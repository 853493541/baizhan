"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CharacterSchema = new mongoose_1.default.Schema({
    name: String,
    account: String,
    owner: String,
    role: String,
    class: String,
    comboBurst: Boolean,
    core: { type: Map, of: Number },
    needs: [String]
}, { _id: false });
const ActiveSchedulingSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    groups: { type: [[CharacterSchema]], required: true },
    createdAt: { type: Date, default: Date.now }
});
const ActiveScheduling = mongoose_1.default.models.ActiveScheduling ||
    mongoose_1.default.model("ActiveScheduling", ActiveSchedulingSchema, "activeScheduling");
exports.default = ActiveScheduling;
