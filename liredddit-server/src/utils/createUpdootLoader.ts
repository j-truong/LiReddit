import DataLoader from "dataLoader";
import { User } from "../entities/User";
import { In } from "typeorm";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () => 
    new DataLoader<{postId: number; userId: number}, Updoot | null>(
        async (keys) => {
        const updoots = await Updoot.findBy(keys as any);
        const updootIdsToUpdoot: Record<string, Updoot> = {};
        updoots.forEach((updoot) => {
            updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
        });

        return keys.map(
            (keys) => updootIdsToUpdoot[`${keys.userId}|${keys.postId}`]
        );
    });