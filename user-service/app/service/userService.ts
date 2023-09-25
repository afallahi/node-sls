import { ErrorResponse, SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { RegisterInput } from "../models/dto/RegisterInput";
import { AppValidationError } from "../utils/errors";
import { getHashedPassword, getSalt } from "../utils/password";
import { LoginInput } from "../models/dto/LoginInput";

@autoInjectable()
export class UserService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async CreateUser(event: APIGatewayProxyEventV2) {

        try {
            const body = event.body;
            const input = plainToClass(RegisterInput, body);
            const error = await AppValidationError(input);
            if(error) return ErrorResponse(401, error);
    
            const salt = await getSalt();
            const hashedPassword = await getHashedPassword(input.password, salt);
            const data = await this.repository.createNewUser({
                userType: "Buyer",
                phone: input.phone,
                email: input.email,
                password: hashedPassword,
                salt: salt,            
            });
    
            return SuccessResponse(data);    
    
        } catch (error) {
            return ErrorResponse(500, error);
        }

    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        try {
            const body = event.body;
            const input = plainToClass(LoginInput, body);
            const error = await AppValidationError(input);
            if(error) return ErrorResponse(401, error);
            const data = await this.repository.findUserByEmail(input.email);
            return SuccessResponse(data);    

        } catch (error) {
            return ErrorResponse(500, error);
        }

    }

}