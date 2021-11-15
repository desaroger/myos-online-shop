import {
    PrimaryGeneratedColumn,
    Entity,
    BaseEntity,
    OneToMany,
    JoinTable
} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {OrderItem} from "./OrderItem";

@Entity()
@ObjectType()
export class Order extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => [OrderItem], {defaultValue: []})
    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    @JoinTable()
    items: Promise<OrderItem[]>;

    @Field(() => Number)
    get price() {
        return (async () => {
            const items = await this.items
            let price = 0
            for (const item of items) {
                const product = await item.product
                price += item.quantity * product.price
            }
            return price
        })()
    }
}