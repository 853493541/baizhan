"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Character.ts
const mongoose_1 = __importDefault(require("mongoose"));
const characterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    abilities: {
        type: Map,
        of: Number,
        default: {}
    }
});
const Character = mongoose_1.default.model('Character', characterSchema, 'JX3');
exports.default = Character;
