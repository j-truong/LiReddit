"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email"
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "username must be greater than 2"
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "username cannot contain @"
            },
        ];
    }
    if (options.password.length <= 2) {
        return [
            {
                field: "password",
                message: "password must be greater than 2"
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map