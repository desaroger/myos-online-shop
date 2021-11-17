import { graphql } from 'graphql'
import { buildSchema } from '../../src/schema';

const schemaPromise = buildSchema()

export const run = async (query: string, variables: object = {}) => {
    const schema = await schemaPromise
    return graphql(schema, query, null, {}, variables)
}
