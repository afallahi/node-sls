"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const userService_1 = require("../service/userService");
const service = new userService_1.UserService();
const Register = (event) => __awaiter(void 0, void 0, void 0, function* () {
    return service.CreateUser(event);
});
exports.Register = Register;
const Login = (event) => __awaiter(void 0, void 0, void 0, function* () {
    return service.LoginUser(event);
});
exports.Login = Login;
//# sourceMappingURL=userHandlers.js.map