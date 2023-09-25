const createResponse = (statusCode: number, data: unknown, message: string) => {

    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify ({
                message,
                data
            }),
        };
    } else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify ({
                message,
            }),
        };
    }
}

export const SuccessResponse = (data: object) => {
    return createResponse(200, data, "success");
}

export const ErrorResponse = (code: number = 1001, error: unknown) => {

    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Unkown Error";
        return createResponse(code, {}, errorMessage);
    }

    return createResponse(code, {}, error as string);
    
}