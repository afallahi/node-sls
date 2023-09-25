import { UserSchema as UserModel } from "../models/UserSchema";
import { DBClient } from "../utils/dbclient";

export class UserRepository {
    constructor() {}

    async createNewUser({ userType, phone, email, password, salt}: UserModel) {

        const client = await DBClient();
        await client.connect();

        const query = "INSERT INTO users(user_type, phone, email, password, salt) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const values = [userType, phone, email, password, salt];
        const res = await client.query(query, values);
        await client.end();
        if(res.rowCount > 0) {
            return res.rows[0] as UserModel;
        } 
        return {}
    }

    async findUserByEmail(email: string) {
        const client = await DBClient();
        await client.connect();

        const query = "SELECT phone, email, password, salt FROM users WHERE email = $1";
        const values = [email];
        const res = await client.query(query, values);
        await client.end();
        if(res.rowCount < 1) {
            throw new Error("user does not exist");
        } 
        return res.rows[0] as UserModel;

    }
}