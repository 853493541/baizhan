"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const characterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    account: { type: String, required: true },
    role: { type: String, required: true },
    class: { type: String, required: true },
    owner: { type: String, required: true },
    abilities: {
        core: { type: Map, of: Number, default: {} },
        healing: { type: Map, of: Number, default: {} }
    },
    comboBurst: { type: Boolean, default: false } // ✅ NEW FIELD IN SCHEMA
});
const Character = mongoose_1.default.models.Character || mongoose_1.default.model('Character', characterSchema, 'JX3');
exports.default = Character;
