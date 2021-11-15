import {Column, PrimaryGeneratedColumn, Entity, BaseEntity, ManyToOne} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Order} from "./Order";
import {Product} from "./Product";

@Entity()
@ObjectType()
export class OrderItem extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    productId: string;

    @Column()
    orderId: string;

    @Field(() => Number)
    @Column({default: 1})
    quantity: number;

    @Field(() => Product)
    @ManyToOne(() => Product)
    product: Promise<Product>;

    @Field(() => Order)
    @ManyToOne(() => Order, order => order.items)
    order: Promise<Order>;
}