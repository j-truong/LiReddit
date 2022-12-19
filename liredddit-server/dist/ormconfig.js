"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    username: "postgres",
    password: "postgres",
    database: "lireddit3",
    logging: true,
    synchronize: true,
    entities: [Post_1.Post, User_1.User],
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
});
//# sourceMappingURL=ormconfig.js.map