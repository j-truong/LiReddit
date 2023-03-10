import { MyContext } from "../types";
import { Resolver, Field, Arg, Mutation, Ctx, ObjectType, Query, FieldResolver, Root } from "type-graphql"
import * as argon2 from "argon2"
import { User } from "../entities/User";
//import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import {v4} from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { DataSource } from "typeorm";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        // this is the current user and its ok to show them their own email
        if (req.session.userId === user.id) {
            return user.email
        }
        // current user wants to see someone elses email
        return "";
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() {redis, req}: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {errors: [
                {
                    field: "newPassword",
                    message: "length must be greater than 2",
                },
            ]};
        }

        const key = FORGET_PASSWORD_PREFIX + token
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }

        const userIdNum = parseInt(userId);
        const user = await User.findOne({ where: { id: userIdNum }});

        if (!user){
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }

        await User.update(
            { id: userIdNum },
            { password: await argon2.hash(newPassword) }
        )

        // log in user after change password 
        req.session.userId = user.id;
        // await redis.del(key);

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string, @Ctx() {redis}: MyContext ) {
        const user = await User.findOne({ where: {email} });
        if (!user) {
            // the email is not in the db
            return true;
        }

        const token = v4();

        await redis.set(
            FORGET_PASSWORD_PREFIX + token, 
            user.id, 
            "EX",
            1000 * 60 * 60 * 24 * 3);

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );
        return true;
    }

    @Query(() => User, {nullable: true})
    async me (@Ctx() {req}: MyContext) {
        if (!req.session.userId) {
            return null
        }
        return User.findOne({ where: {id: req.session.userId} });
    }

    @Query(() => [User])
    users(@Ctx() {}: MyContext): Promise<User[]> {
        return User.find({});
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {req, dataSource}: MyContext
    ): Promise <UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return {errors};
        }

        //const emFork = em.fork()
        const hashedPassword = await argon2.hash(options.password);
        // const user = emFork.create(User, {
        //     username: options.username,
        //     password: hashedPassword,
        // });
        let user;
        try {
            

            const result = await dataSource
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                })
                .returning("*")
                .execute();

            console.log(result)
            user= result.raw[0];
            console.log("user result");
            console.log(user);
        } catch (err) {
            console.log(err);
            console.log(err.detail);
            // || err.detail.includes("already exists")
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ],
                };
            }
        }

        // store userid in session
        // this will set a cookie on user
        // keep them logged in
        req.session.userId = user.id;

        return {
            user
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes("@")
              ? { where: { email: usernameOrEmail } }
              : { where: { username: usernameOrEmail } }
          );
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesnt exist"
                    },
                ],
            };
        }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
        return {
            errors: [
                {
                    field: "password",
                    message: "incorrect password",
                },
            ],
        };
    }

    req.session.userId= user.id;
    //req.session

    return {
        user,
    };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: MyContext) {
        return new Promise((resolve) =>
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            res.clearCookie(COOKIE_NAME);
            resolve(true);
        })
        );
    }    
}