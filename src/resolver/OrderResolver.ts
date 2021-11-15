import {Resolver, Query, Arg, Mutation} from "type-graphql";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import { AddItemToOrderInput } from "./inputs/AddItemToOrderInput";

@Resolver(() => Order)
export class OrderResolver {
    @Query(() => Order)
    order(@Arg("id") id: string) {
        return Order.findOne({ where: { id } });
    }

    @Mutation(() => Order)
    async createOrder() {
        const order = Order.create();
        await order.save();
        return order;
    }

    @Mutation(() => Order)
    async AddItemToOrder(@Arg("data") data: AddItemToOrderInput) {
        // LOCKS?
        let orderItem: OrderItem = await OrderItem.findOne({
            where: {
                order: {id: data.orderId},
                product: {id: data.productId},
            }
        })

        if (orderItem) {
            orderItem.quantity++
        } else {
            orderItem = OrderItem.create({
                order: Promise.resolve({id: data.orderId}),
                product: Promise.resolve({id: data.productId})
            })
        }

        await orderItem.save()

        return orderItem;
    }
}