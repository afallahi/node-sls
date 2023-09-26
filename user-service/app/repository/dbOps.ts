import { DBClient } from "../utils/dbclient";

export class DBOps {
    constructor() {}

    async executeQuery(query: string, values: unknown[]) {
        const client = await DBClient();
        await client.connect();
        const res = await client.query(query, values);
        await client.end();
        return res;
    }    
}