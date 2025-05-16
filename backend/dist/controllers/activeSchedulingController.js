"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchedule = exports.testDirectRead = exports.createSchedule = exports.getAllSchedules = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ActiveScheduling_1 = __importDefault(require("../models/ActiveScheduling"));
const getAllSchedules = async (req, res) => {
    console.log('📥 [Route] GET /api/active-scheduling');
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error('Mongoose not connected (readyState=' + mongoose_1.default.connection.readyState + ')');
        }
        console.log('🔍 Attempting ActiveScheduling.find()...');
        const schedules = await ActiveScheduling_1.default.find();
        console.log('✅ Schedules found:', schedules.length);
        res.json(schedules);
    }
    catch (err) {
        console.error('❌ [Controller Error] Failed to fetch schedules:', err);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};
exports.getAllSchedules = getAllSchedules;
const createSchedule = async (req, res) => {
    console.log('🆕 [Route] POST /api/active-scheduling/create');
    try {
        const { name } = req.body;
        const newSchedule = await ActiveScheduling_1.default.create({
            name,
            groups: [[], [], [], [], [], [], [], []],
            createdAt: new Date()
        });
        console.log('✅ Created new schedule:', newSchedule.name);
        res.json(newSchedule);
    }
    catch (err) {
        console.error('❌ Failed to create schedule:', err);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
};
exports.createSchedule = createSchedule;
const testDirectRead = async (req, res) => {
    console.log('🔌 [Route] GET /api/active-scheduling/test-direct');
    try {
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('MongoDB connection not ready (db is undefined)');
        }
        const result = await db.collection('activeScheduling').find({}).toArray();
        console.log('🧪 Raw result count:', result.length);
        res.json(result);
    }
    catch (err) {
        console.error('❌ Raw MongoDB read failed:', err);
        res.status(500).json({ error: 'Raw read failed' });
    }
};
exports.testDirectRead = testDirectRead;
const updateSchedule = async (req, res) => {
    console.log('📝 [Route] POST /api/active-scheduling/:id');
    try {
        const { id } = req.params;
        const { groups } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid schedule ID' });
        }
        const updated = await ActiveScheduling_1.default.findByIdAndUpdate(id, { groups }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        console.log('✅ Schedule updated:', updated._id);
        res.json(updated);
    }
    catch (err) {
        console.error('❌ Failed to update schedule:', err);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
};
exports.updateSchedule = updateSchedule;
