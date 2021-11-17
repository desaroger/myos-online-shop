import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateProductInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    picture: string;

    @Field()
    price: number;
}