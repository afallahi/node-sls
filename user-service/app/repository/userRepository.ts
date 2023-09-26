import { UserSchema as UserModel } from "../models/UserSchema";
import { DBClient } from "../utils/dbclient";
import { DBOps } from "./dbOps";

export class UserRepository extends DBOps {
    constructor() {
        super();
    }

    async createNewUser({ userType, phone, email, password, salt}: UserModel) {
        const query = "INSERT INTO users(user_type, phone, email, password, salt) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const values = [userType, phone, email, password, salt];
        const res = await this.executeQuery(query, values);
        if(res.rowCount > 0) {
            return res.rows[0] as UserModel;
        } 
        return {}
    }

    async findUserByEmail(email: string) {
        const query = "SELECT phone, email, password, salt, verification_code, expiry FROM users WHERE email = $1";
        const values = [email];
        const res = await this.executeQuery(query, values);
        if(res.rowCount < 1) {
            throw new Error("user does not exist");
        } 
        return res.rows[0] as UserModel;
    }

    async updateVerificationCode( email: string, code: number, expiry: Date ) {
        //const query = "UPDATE users SET verification_code=$1 expiry=$2 WHERE user_id=$3 RETURNING *";
        const query = "UPDATE users SET verification_code=$1 WHERE email=$2 RETURNING *";
        //const values = [code, expiry, userId];
        const values = [code, email];
        const res = await this.executeQuery(query, values);
        if(res.rowCount > 0) {
            return res.rows[0] as UserModel;
        } 
        return {}
    }

}