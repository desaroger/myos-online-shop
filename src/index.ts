import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from './schema';
import ormConfig from '../ormconfig';

async function main() {
    await createConnection(ormConfig)
    const schema = await buildSchema()
    const server = new ApolloServer({ schema })

    const port = process.env.PORT || 3000
    await server.listen({ port })
    console.log(`Server listening port ${port}`)
}

main()
