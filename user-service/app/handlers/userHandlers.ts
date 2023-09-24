import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";

const service = container.resolve(UserService);

export const Register = middy((event: APIGatewayProxyEventV2) => {    
    return service.CreateUser(event);
}).use(bodyParser());

export const Login = async (event: APIGatewayProxyEventV2) => {
    return service.LoginUser(event);
};