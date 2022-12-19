"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserLoader = void 0;
const dataLoader_1 = __importDefault(require("dataLoader"));
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
const createUserLoader = () => new dataLoader_1.default(async (userIds) => {
    const users = await User_1.User.findBy({ id: (0, typeorm_1.In)(userIds) });
    const userIdToUser = {};
    users.forEach((u) => {
        userIdToUser[u.id] = u;
    });
    return userIds.map((userId) => userIdToUser[userId]);
});
exports.createUserLoader = createUserLoader;
//# sourceMappingURL=createUserLoader.js.map