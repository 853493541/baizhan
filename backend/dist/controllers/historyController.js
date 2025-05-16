"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHistory = getAllHistory;
const db_1 = require("../utils/db");
async function getAllHistory(req, res) {
    try {
        const db = await (0, db_1.getDb)();
        const history = await db.collection('history').find().sort({ savedAt: -1 }).toArray();
        res.json(history);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
}
