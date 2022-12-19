"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdootLoader = void 0;
const dataLoader_1 = __importDefault(require("dataLoader"));
const Updoot_1 = require("../entities/Updoot");
const createUpdootLoader = () => new dataLoader_1.default(async (keys) => {
    const updoots = await Updoot_1.Updoot.findBy(keys);
    const updootIdsToUpdoot = {};
    updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
    });
    return keys.map((keys) => updootIdsToUpdoot[`${keys.userId}|${keys.postId}`]);
});
exports.createUpdootLoader = createUpdootLoader;
//# sourceMappingURL=createUpdootLoader.js.map