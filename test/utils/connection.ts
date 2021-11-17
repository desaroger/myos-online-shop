import { createConnection, getConnection } from 'typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import ormConfig from '../../ormconfig';

/**
 * Creates a new DB connection against a sqlite memory DB.
 */
export async function create() {
    const config: ConnectionOptions = {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: ormConfig.entities,
        migrations: ormConfig.migrations,
        subscribers: ormConfig.subscribers,
        cli: ormConfig.cli,
        synchronize: true,
        logging: false
    }

    await createConnection(config);
}

/**
 * Closes the DB connection.
 */
export async function close() {
    await getConnection().close();
}

/**
 * Clears all the database.
 * TODO find a way to do it truncating the tables instead of regenerating the entire DB
 */
export async function clear(){
    await close()
    await create()
}
