"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const characterSchema = new mongoose_1.default.Schema({
    _id: String,
    name: String,
    account: String,
    owner: String,
    role: { type: String, enum: ['DPS', 'Healer', 'Tank'] },
    comboBurst: Boolean,
    core: { type: Map, of: Number },
    needs: [String]
}, { _id: false });
const groupSchema = new mongoose_1.default.Schema({
    groupIndex: Number,
    completed: Boolean,
    note: String,
    characters: [characterSchema]
}, { _id: false });
const currentScheduleSchema = new mongoose_1.default.Schema({
    weekTag: String,
    createdAt: Date,
    groups: [groupSchema]
});
// 👇 force collection name to match exactly: "currentSchedule"
exports.default = mongoose_1.default.models.currentSchedule ||
    mongoose_1.default.model('currentSchedule', currentScheduleSchema, 'currentSchedule');
