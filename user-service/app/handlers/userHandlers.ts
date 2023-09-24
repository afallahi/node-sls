import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const service = new UserService();

export const Register = async (event: APIGatewayProxyEventV2) => {    
    return service.CreateUser(event);
};

export const Login = async (event: APIGatewayProxyEventV2) => {
    return service.LoginUser(event);
};