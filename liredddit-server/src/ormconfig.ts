import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';
import { Post } from './entities/Post';
import { User } from './entities/User';
 
config();

export default new DataSource({
  type: "postgres",
  username: "postgres",
  password: "postgres",
  database: "lireddit3",
  logging: true,
  synchronize: true,
  entities: [Post, User],
  migrations: [path.join(__dirname, "./migrations/*")],
});