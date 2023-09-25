import { ErrorResponse, SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { RegisterInput } from "../models/dto/RegisterInput";
import { AppValidationError } from "../utils/errors";

@autoInjectable()
export class UserService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        const body = event.body;
        const input = plainToClass(RegisterInput, body);
        const error = await AppValidationError(input);
        if(error) return ErrorResponse(401, error);

        const salt = "";
        const hashedPassword = "";
        const data = await this.repository.CreateNewUser({
            userType: "Buyer",
            email: input.email,
            password: hashedPassword,
            salt: salt,
            phone: input.phone
        });

        return SuccessResponse(input);    
    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({message: "user logged in successfully."})    
    }

}