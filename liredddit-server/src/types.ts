//import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response } from "express";
import { Session } from "express-session";
import Redis from "ioredis";
import { DataSource } from "typeorm";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
    //em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {session: Session};
    redis: Redis,
    res: Response,
    dataSource: DataSource,
    userLoader: ReturnType<typeof createUserLoader>,
    updootLoader: ReturnType<typeof createUpdootLoader>,
}