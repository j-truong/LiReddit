import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";

export const dataSource = new DataSource({
    type: "postgres",
    username: "postgres",
    password: "postgres",
    database: "lireddit3",
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
    //entities: ["dist/**/*.entity.js"],
    migrations: [path.join(__dirname, "./migrations/*")],
});