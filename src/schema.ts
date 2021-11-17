import 'reflect-metadata';
import { buildSchema as graphQlBuildSchema } from 'type-graphql';
import { ProductResolver } from './resolver/ProductResolver';
import { OrderResolver } from './resolver/OrderResolver';

export function buildSchema () {
    return graphQlBuildSchema({
        resolvers: [ProductResolver, OrderResolver]
    })
}
