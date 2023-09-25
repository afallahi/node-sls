export interface UserSchema {
    user_id?: string;
    userType: "Buyer" | "Seller";
    email: string;
    password: string;
    salt: string;
    phone: string;
}