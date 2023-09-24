import { SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        const body = event.body;
        console.log(body);

        await this.repository.CreateUserOperation();

        return SuccessResponse({message: "user created successfully."})    
    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({message: "user logged in successfully."})    
    }

}