import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from './schema';

async function main() {
    await createConnection()
    const schema = await buildSchema()
    const server = new ApolloServer({ schema })

    const host = process.env.HOST || 'localhost'
    const port = process.env.PORT || 3000
    await server.listen({ port, host })
    console.log(`Server listening port ${host}:${port}`)
}

main()
