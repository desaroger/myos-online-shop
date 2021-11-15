import { InputType, Field } from "type-graphql";

@InputType()
export class AddItemToOrderInput {
    @Field()
    orderId: string;

    @Field()
    productId: string;

    @Field({ defaultValue: 1 })
    quantity: number;
}