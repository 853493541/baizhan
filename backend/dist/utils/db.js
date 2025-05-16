"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI;
const client = new mongodb_1.MongoClient(uri);
let dbInstance;
async function getDb() {
    if (!dbInstance) {
        await client.connect();
        dbInstance = client.db('baizhan');
    }
    return dbInstance;
}
