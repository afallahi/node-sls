import { SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export class UserService {
    constructor() {}

    async CreateUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({message: "user created successfully."})    
    }

    async LoginUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({message: "user logged in successfully."})    
    }

}