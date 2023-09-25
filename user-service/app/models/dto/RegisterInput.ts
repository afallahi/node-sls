import { Length } from "class-validator";
import { LoginInput } from "./LoginInput";

export class RegisterInput extends LoginInput {
    @Length(4, 13)  // TODO: change the min to 10 later
    phone: string;
}