"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const characterSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: String,
    account: String,
    role: String,
    class: String,
    abilities: Object
}, { _id: false });
const groupSchema = new mongoose_1.default.Schema({
    week: { type: String, required: true },
    groupIndex: { type: Number, required: true },
    characters: [characterSchema]
});
exports.default = mongoose_1.default.model('Group', groupSchema);
