import "reflect-metadata";
//import { MikroORM } from "@mikro-orm/core";
// import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { COOKIE_NAME, __prod__ } from "./constants";
// import { Post } from "./entities/Post";
//import config from './mikro-orm.config';
import express from 'express'
import {ApolloServer, ExpressContext} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
// import cors from "cors";
import { UserResolver } from "./resolvers/user";
// import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
//import { MyContext } from "./types";
import Redis from "ioredis";
import cors from "cors";
//import { Config } from "apollo-server-core";
//import { sendEmail } from "./utils/sendEmail";
import { User } from "./entities/User";
// import { ApolloServerPluginLandingPageGraphQLPlayground,
//     ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import path from "path";
//import { Book } from "./entities/Book";
import { dataSource } from "./dataSource";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

export = session;

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const main = async () => {

    await dataSource
        .initialize()
        .then(() => {
            console.log("Data Source has been initialized!");
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });

    await dataSource.runMigrations();
    // await Post.delete({});

    // const orm = await MikroORM.init(config);
    // //await orm.em.nativeDelete(User, {});
    // await orm.getMigrator().up;

    // const generator = orm.getSchemaGenerator();
    // await generator.updateSchema();

    await Post.delete;

    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis();
    app.set("trust proxy", !__prod__);
    app.use(
        cors({
            origin: ["http://localhost:3000", "https://studio.apollographql.com"],
            credentials:true
        })
    );
    // app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    // app.set("Access-Control-Allow-Credentials", true);

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true,
                disableTTL: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                //sameSite: "none", // csrf lax
                sameSite: "lax",
                secure: true // __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: "kdfsfdsfsdf",
            resave: false,
        })
    )

    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}) => ({
            //em: orm.em, 
            req, 
            res, 
            redis,
            dataSource,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader(),
        }),
    });

    app.get('/', (_, res) => {
       res.send("hello")
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, 
        cors: false 
    });
    app.listen(4000, () => {
        console.log("server started on localhost:4000")
    })
};

main().catch((err) => {
    console.error(err);
})