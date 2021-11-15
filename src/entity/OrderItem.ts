import {Column, PrimaryGeneratedColumn, Entity, BaseEntity, ManyToOne, JoinTable} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Order} from "./Order";
import {Product} from "./Product";

@Entity()
@ObjectType()
export class OrderItem extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => Number)
    @Column({default: 1})
    quantity: number;

    @Field(() => Product)
    @ManyToOne(() => Product)
    @JoinTable()
    product: Promise<Product>;

    @Field(() => Order)
    @ManyToOne(() => Order, order => order.items)
    @JoinTable()
    order: Promise<Order>;
}