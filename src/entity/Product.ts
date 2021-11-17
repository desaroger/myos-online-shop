import { Column, PrimaryGeneratedColumn, Entity, BaseEntity } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    description: string;

    @Field(() => String)
    @Column()
    picture: string;

    @Field(() => Number)
    @Column()
    price: number;
}