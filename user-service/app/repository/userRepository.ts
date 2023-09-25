import { UserSchema as UserModel } from "../models/UserSchema";

export class UserRepository {
    constructor() {}

    async CreateNewUser({ email, password, salt, phone, userType }: UserModel) {
        console.log("Created New User");
        return {}
    }
}