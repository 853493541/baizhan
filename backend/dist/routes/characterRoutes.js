"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Character_1 = __importDefault(require("../models/Character"));
const router = express_1.default.Router();
// GET all characters, optionally filter by owner
router.get('/', async (req, res) => {
    const { owner } = req.query;
    const query = owner ? { owner } : {};
    try {
        const characters = await Character_1.default.find(query);
        res.json(characters);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});
// GET one character by Mongo _id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const character = await Character_1.default.findById(id);
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json(character);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// PUT full character update by Mongo _id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const incomingData = req.body;
    // Ensure abilities are structured properly
    const structuredAbilities = {
        core: incomingData.abilities?.core || {},
        healing: incomingData.abilities?.healing || {},
    };
    const updatedData = {
        ...incomingData,
        abilities: structuredAbilities,
    };
    try {
        const character = await Character_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json({ message: 'Character updated', character });
    }
    catch (err) {
        console.error('❌ 更新失败:', err);
        res.status(500).json({ error: 'Failed to update character' });
    }
});
exports.default = router;
