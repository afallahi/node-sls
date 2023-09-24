import { APIGatewayProxyEventV2 } from "aws-lambda";


export const Register = async (event: APIGatewayProxyEventV2) => {
    console.log(`Event: ${event}`);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify ({
            message: "response from register",
            data: {}
        }),
    };
};

export const Login = async (event: APIGatewayProxyEventV2) => {
    console.log(`Event: ${event}`);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify ({
            message: "response from login",
            data: {}
        }),
    };
};