import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  PrimaryColumn,
  //OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";
//import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field()
  @Column({ type: "int"})
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE"
  })
  post: Post;
}