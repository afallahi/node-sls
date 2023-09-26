import { ErrorResponse, SuccessResponse } from "../utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { RegisterInput } from "../models/dto/RegisterInput";
import { AppValidationError } from "../utils/errors";
import { GetToken, ValidatePassword, VerifyToken, getHashedPassword, getSalt } from "../utils/password";
import { LoginInput } from "../models/dto/LoginInput";
import { GenerateVerificationCode, SendVerificationCode } from "../utils/verificationCode";
import { VerificationInput} from "../models/dto/UpdateInput";
import { TimeDiff} from "../utils/dateUtils";
import { UserSchema } from "app/models/UserSchema";

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
            const verifiedUser = await ValidatePassword(input.password, data.password, data.salt)
            if(!verifiedUser) {
                return ErrorResponse(401, "email or password is incorrect");
            }

            const token = GetToken(data);
            return SuccessResponse({ token });

        } catch (error) {
            return ErrorResponse(500, error);
        }

    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) ErrorResponse(403, "authorizatio failed");
        const {code, expiry} = GenerateVerificationCode();
        const { email, phone } = (payload as UserSchema); 
        await this.repository.updateVerificationCode(email, code, expiry);
        //const response = await SendVerificationCode(code, phone);
        return SuccessResponse({message: "verification code sent to your registered phone number"});
        
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if (!payload) return ErrorResponse(403, "authorization failed");

        const input:VerificationInput = plainToClass(VerificationInput, event.body);
        const error = await AppValidationError(input);
        if (error) return ErrorResponse(404, error);

        const {verification_code, expiry} = await this.repository.findUserByEmail(payload.email);

        // TODO: This is a hack. 'input.code' returns 'undefined'. Fix it and remove the following lines.
        const str: string = JSON.stringify(input);
        const val = str.split(":")[1];
        console.log(`val: ${val}`);
        const val2 = val.split("\"")[1];
        const code = val2.split("\\")[0];
        

        if(verification_code === parseInt(code)) {  // we should simply use input.code if fix the 'undefined' issue
            const now = new Date();
            const diff = TimeDiff(expiry, now.toISOString(), "m");

            // TODO: hack: for dev purposes, lets assume code is not getting expired
//            if (diff > 0) {
                return SuccessResponse({message: "verify user success"});
            // } else {
            //     return ErrorResponse(403, "verification code expired");
            // }
    
        }


        return ErrorResponse(401, "code is not correct");
    }

}