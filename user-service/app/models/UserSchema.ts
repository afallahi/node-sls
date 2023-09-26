export interface UserSchema {
    user_id?: string;
    userType: "Buyer" | "Seller";
    email: string;
    password: string;
    salt: string;
    phone: string;
    first_name?: string;
    last_name?: string;
    profile_pic?: string;
    verification_code?: number,
    expiry?: string;
}