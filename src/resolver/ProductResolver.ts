import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Product } from '../entity/Product';
import { CreateProductInput } from './inputs/CreateProductInput';

@Resolver()
export class ProductResolver {
    @Query(() => [Product])
    products() {
        return Product.find()
    }

    @Query(() => Product)
    product(@Arg('id') id: string) {
        return Product.findOne({ where: { id } });
    }

    @Mutation(() => Product)
    async createProduct(@Arg('data') data: CreateProductInput) {
        const product = Product.create(data);
        await product.save();
        return product;
    }
}