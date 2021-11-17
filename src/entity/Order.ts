import {
    PrimaryGeneratedColumn,
    Entity,
    BaseEntity,
    OneToMany,
    Column, In
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { OrderItem } from './OrderItem';
import { Product } from './Product';

export const OrderStatus = {

    /**
     * The order is still a shopping cart, where products can be added/removed and price can change.
     */
    CART: 'cart',

    /**
     * The order has been confirmed, price is fixed and we are waiting the user to finish the transaction, fill
     * all the information and to pay.
     */
    CONFIRMED: 'confirmed',

    /**
     * We have received the payment, the shipment process has been started.
     */
    PAID: 'paid',

    /**
     * The products are now in the shipping company ready to be sent.
     */
    DISPATCHED: 'dispatched',

    /**
     * The shipping company confirmed the products have arrived to the destination.
     */
    COMPLETED: 'completed'
}

@Entity()
@ObjectType()
export class Order extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => [OrderItem])
    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items: Promise<OrderItem[]>;

    @Field(() => String)
    @Column({ default: OrderStatus.CART })
    status: string;

    /**
     * This column is used to store the final price calculated on the moment
     * the order is confirmed.
     */
    @Column({ nullable: true })
    finalPrice!: number;

    /**
     * Gets the order price.
     *
     * The price will be calculated if the order is a CART or will be the
     * price calculated on the moment when the order was confirmed.
     */
    @Field(() => Number)
    get price(): Promise<number> {
        return (async () => {
            if (this.status != OrderStatus.CART) {
                return this.finalPrice
            }

            const items = await this.items
            const productIds = items.map(item => item.productId)
            const products = await Product.find({ where: { id: In(productIds) }, select: ['id', 'price'] })
            const productsPrices = products.reduce((result, product) => {
                result[product.id] = product.price
                return result
            }, {})

            let price = 0
            for (const item of items) {
                const productPrice = productsPrices[item.productId]
                price += item.quantity * productPrice
            }
            return price
        })()
    }

    /**
     * Sets the quantity for a given product.
     * TODO This should use locks
     *
     * @param {string} productId
     * @param {number} [quantity=1]
     */
    async setItem(productId: string, quantity = 1) {
        if (this.status !== OrderStatus.CART) {
            throw new Error(`You can not modify the order once it is confirmed. Current status "${this.status}".`)
        }

        let orderItem = await OrderItem.findOne({
            where: {
                orderId: this.id,
                productId: productId,
            }
        })

        if (orderItem) {
            if (quantity === 0) {
                await orderItem.remove()
                return
            }

            if (orderItem.quantity === quantity) {
                return
            }
        } else {
            orderItem = OrderItem.create({
                orderId: this.id,
                productId: productId
            })
        }

        orderItem.quantity = quantity
        await orderItem.save()
    }

    /**
     * Confirms the current order, fixing the price to the current value.
     */
    async confirm() {
        if (this.status !== OrderStatus.CART) {
            throw new Error(`Invalid status "${this.status}" for confirming.`)
        }

        this.finalPrice = await this.price
        this.status = OrderStatus.CONFIRMED
        await this.save()
    }
}