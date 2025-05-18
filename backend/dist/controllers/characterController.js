"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoreCharacters = getCoreCharacters;
exports.getFullCharacters = getFullCharacters;
exports.getCharacterSummary = getCharacterSummary;
exports.updateCharacter = updateCharacter;
const db_1 = require("../utils/db");
const mongodb_1 = require("mongodb");
const CORE_LIST = ['钱', '斗', '天', '黑', '引'];
const ABILITY_ALIASES = {
    '天诛': '天',
    '黑煞': '黑',
    '引燃': '引',
    '花钱': '钱',
    '斗转': '斗',
};
async function getCoreCharacters(req, res) {
    try {
        const db = await (0, db_1.getDb)();
        const characters = await db.collection('characters').find().toArray();
        const processed = characters.map((char) => {
            const originalCore = char.abilities?.core || {};
            const parsedCore = {};
            const needs = [];
            for (const [name, rawLevel] of Object.entries(originalCore)) {
                const alias = ABILITY_ALIASES[name] || name;
                const level = rawLevel;
                if (!CORE_LIST.includes(alias))
                    continue;
                if (level >= 9) {
                    parsedCore[alias] = Math.max(parsedCore[alias] || 0, level);
                }
                else {
                    if (!needs.includes(alias))
                        needs.push(alias);
                }
            }
            return {
                name: char.name,
                role: char.role,
                account: char.account,
                owner: char.owner,
                comboBurst: char.comboBurst,
                core: parsedCore,
                needs
            };
        });
        res.json(processed);
    }
    catch (err) {
        console.error('Failed to fetch core characters:', err);
        res.status(500).json({ error: 'Failed to fetch core characters' });
    }
}
async function getFullCharacters(req, res) {
    try {
        const db = await (0, db_1.getDb)();
        const characters = await db.collection('characters').find().toArray();
        const processed = characters.map((char) => {
            const originalCore = char.abilities?.core || {};
            const aliasedCore = {};
            for (const [name, rawLevel] of Object.entries(originalCore)) {
                const alias = ABILITY_ALIASES[name] || name;
                aliasedCore[alias] = Math.max(aliasedCore[alias] || 0, rawLevel);
            }
            return {
                ...char,
                abilities: {
                    ...char.abilities,
                    core: aliasedCore
                }
            };
        });
        res.json(processed);
    }
    catch (err) {
        console.error('Failed to fetch characters:', err);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
}
async function getCharacterSummary(req, res) {
    try {
        const db = await (0, db_1.getDb)();
        const characters = await db.collection('characters').find().toArray();
        const needsCount = {};
        const needsDetail = {};
        const level10 = {};
        for (const char of characters) {
            const originalCore = char.abilities?.core || {};
            const seenNeeds = new Set();
            for (const [name, level] of Object.entries(originalCore)) {
                const alias = ABILITY_ALIASES[name] || name;
                if (!CORE_LIST.includes(alias))
                    continue;
                if (level < 9 && !seenNeeds.has(alias)) {
                    needsCount[alias] = (needsCount[alias] || 0) + 1;
                    if (!needsDetail[alias])
                        needsDetail[alias] = [];
                    needsDetail[alias].push({ name: char.name, role: char.role });
                    seenNeeds.add(alias);
                }
                if (level === 10) {
                    if (!level10[alias])
                        level10[alias] = [];
                    level10[alias].push({ name: char.name, role: char.role });
                }
            }
        }
        return res.json({ needsCount, needsDetail, level10 });
    }
    catch (err) {
        console.error('Failed to fetch summary:', err);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
}
async function updateCharacter(req, res) {
    console.log('🟡 PUT /api/characters/:id hit with ID =', req.params.id);
    try {
        const db = await (0, db_1.getDb)();
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            console.log('❌ Invalid ObjectId:', id);
            return res.status(400).json({ error: 'Invalid character ID' });
        }
        const { _id, ...safeUpdate } = req.body;
        const result = await db.collection('characters').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: safeUpdate });
        if (result.matchedCount === 0) {
            console.log('⚠️ Character not found or unchanged:', id);
            return res.status(404).json({ error: 'Character not found or no changes' });
        }
        console.log('✅ Character updated:', id);
        res.json({ message: '✅ Character updated successfully' });
    }
    catch (err) {
        console.error('❌ Failed to update character:', err);
        res.status(500).json({ error: 'Failed to update character' });
    }
}
