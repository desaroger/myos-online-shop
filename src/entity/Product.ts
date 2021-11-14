import {Column, PrimaryGeneratedColumn, Entity, BaseEntity} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    description: string;
}