import { UserService } from "../service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";
import { ErrorResponse } from "../utils/response";

const service = container.resolve(UserService);

export const Register = middy((event: APIGatewayProxyEventV2) => {    
    return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
    return service.LoginUser(event);
}).use(bodyParser());

export const Verify = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if(httpMethod === "get") {
        return service.GetVerificationToken(event);
    } else if (httpMethod === "post") {
        return service.VerifyUser(event);
    } else {
        return ErrorResponse(404, "Not Found!")
    }
}