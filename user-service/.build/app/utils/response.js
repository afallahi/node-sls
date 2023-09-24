"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const createResponse = (statusCode, data, message) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message,
                data
            }),
        };
    }
    else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message,
            }),
        };
    }
};
const SuccessResponse = (data) => {
    return createResponse(200, data, "success");
};
exports.SuccessResponse = SuccessResponse;
const ErrorResponse = (code = 1001, error) => {
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Unkown Error";
        return createResponse(code, {}, errorMessage);
    }
    return createResponse(code, {}, error);
};
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=response.js.map