import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import {buildSchema} from "type-graphql";
import {ProductResolver} from "./resolver/ProductResolver";
import {OrderResolver} from "./resolver/OrderResolver";

async function main() {
    await createConnection()
    const schema = await buildSchema({
        resolvers: [ProductResolver, OrderResolver]
    })
    const server = new ApolloServer({ schema })
    const port = process.env.PORT || 3000
    await server.listen(port)
    console.log(`Server listening port ${port}`)
}

main()
