import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Order } from '../entity/Order';
import { SetOrderItemInput } from './inputs/SetOrderItemInput';

@Resolver(() => Order)
export class OrderResolver {
    @Query(() => Order, { nullable: true })
    order(@Arg('id') id: string) {
        return Order.findOne({ where: { id } });
    }

    @Mutation(() => Order)
    async createOrder() {
        const order = Order.create();
        await order.save();
        return order;
    }

    @Mutation(() => Order)
    async setOrderItem(@Arg('data') data: SetOrderItemInput) {
        const order = await Order.findOne({ where: { id: data.orderId } });
        if (!order) {
            throw new Error(`Order with id "${data.orderId}" not found.`)
        }

        await order.setItem(data.productId, data.quantity)

        return order;
    }

    @Mutation(() => Order)
    async confirm(@Arg('id') id: string) {
        const order = await Order.findOne({ where: { id } });
        if (!order) {
            throw new Error(`Order with id "${id}" not found.`)
        }

        await order.confirm()

        return order
    }
}