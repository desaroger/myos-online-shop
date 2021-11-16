import {createConnection, getConnection} from 'typeorm';
import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";

const originalConnectionData = require('../../ormconfig.json');

export async function create() {
    const config: ConnectionOptions = {
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: originalConnectionData.entities,
        migrations: originalConnectionData.migrations,
        subscribers: originalConnectionData.subscribers,
        cli: originalConnectionData.cli,
        synchronize: true,
        logging: false
    }

    await createConnection(config);
}

export async function close() {
    await getConnection().close();
}

export async function clear(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const promises = entities.map(async (entity) => {
        const repository = connection.getRepository(entity.name);
        await repository.query(`delete from "${entity.tableName}"`)
        await repository.query(`delete from sqlite_sequence where name="${entity.tableName}"`)
    });
    await Promise.all(promises)
}
