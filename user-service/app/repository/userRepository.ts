import { UserSchema as UserModel } from "../models/UserSchema";
import { DBClient } from "../utils/dbclient";

export class UserRepository {
    constructor() {}

    async CreateNewUser({ userType, phone, email, password, salt}: UserModel) {

        const client = await DBClient();
        await client.connect();

        const query = "INSERT INTO users(user_type, phone, email, password, salt) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const values = [userType, phone, email, password, salt];
        const res = await client.query(query, values);
        await client.end();
        console.log(`res ${JSON.stringify(res)}`);
        if(res.rowCount > 0) {
            console.log(`res row0: ${res.rows}`);
            return res.rows[0] as UserModel;
        } else {
            console.log("no user created");
        }
        console.log("returns here");
        return {}
    }
}