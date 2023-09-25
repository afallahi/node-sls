import { IsEmail, Length } from "class-validator";

export class LoginInput {
    @IsEmail()
    email: string;
    @Length(4, 40)  // change the min later to make a stronger passwords
    password: string;    
}