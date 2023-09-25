import { UserSchema } from "../models/UserSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY= "sew9939pwpppwpeokdffjfjriru44030423-edmmfvnvdmjrp4l4k";  //TODO: remove hardcoded secret

export const getSalt = async () => {
    return await bcrypt.genSalt();
};

export const getHashedPassword = async (
    password: string, 
    salt: string
) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (
    password: string,
    savedPassword: string,
    salt: string
) => {
    return (await getHashedPassword(password, salt)) === savedPassword;
}

export const GetToken = ({ user_id, userType, email, phone}: UserSchema) => {
    return jwt.sign({ user_id, userType, email, phone }, JWT_SECRET_KEY, { expiresIn: "1d"});
}

export const VerifyToken = async (token: string): Promise<UserSchema | false> => {

    try {
        if(token !== "") {
            const payload = await jwt.verify(token.split(" ")[1], JWT_SECRET_KEY);
            return payload as UserSchema;
        }
        return false;    
    } catch (error) {
        console.log(error);
        return false;
    }
}