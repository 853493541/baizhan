"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Character_1 = __importDefault(require("../models/Character"));
const router = express_1.default.Router();
// GET all characters
router.get('/', async (_req, res) => {
    try {
        const characters = await Character_1.default.find();
        res.json(characters);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const character = await Character_1.default.findOne({ name });
        if (!character)
            return res.status(404).json({ error: 'Character not found' });
        res.json(character);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// PUT full character update
router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const updatedData = req.body;
    try {
        const character = await Character_1.default.findOneAndUpdate({ name }, updatedData, { new: true, runValidators: true });
        if (!character)
            return res.status(404).json({ error: 'Character not found' });
        res.json({ message: 'Character updated', character });
    }
    catch (err) {
        console.error('❌ 更新失败:', err);
        res.status(500).json({ error: 'Failed to update character' });
    }
});
exports.default = router;
