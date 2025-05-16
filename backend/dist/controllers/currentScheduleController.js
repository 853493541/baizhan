"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentSchedule = exports.setCurrentSchedule = exports.getCurrentSchedule = void 0;
const currentScheduleModel_1 = __importDefault(require("../models/currentScheduleModel"));
const getCurrentSchedule = async (req, res) => {
    try {
        const current = await currentScheduleModel_1.default.findOne().sort({ createdAt: -1 });
        if (!current) {
            return res.status(404).json({ message: 'No schedule found' });
        }
        res.json(current);
    }
    catch (err) {
        console.error('❌ Failed to fetch current schedule:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCurrentSchedule = getCurrentSchedule;
const setCurrentSchedule = async (req, res) => {
    try {
        const { schedule } = req.body;
        if (!Array.isArray(schedule) ||
            schedule.length !== 8 ||
            !schedule.every(g => typeof g.groupIndex === 'number' && Array.isArray(g.characters))) {
            return res.status(400).send('Invalid schedule format');
        }
        const groups = schedule.map(g => ({
            groupIndex: g.groupIndex,
            characters: g.characters,
            completed: false,
            note: ""
        }));
        await currentScheduleModel_1.default.deleteMany({});
        await currentScheduleModel_1.default.create({
            groups,
            weekTag: new Date().toISOString().slice(0, 10),
            createdAt: new Date(),
        });
        res.send('✅ Schedule saved');
    }
    catch (err) {
        console.error('❌ Failed to save current schedule:', err);
        res.status(500).send('Error saving current schedule');
    }
};
exports.setCurrentSchedule = setCurrentSchedule;
const updateCurrentSchedule = async (req, res) => {
    try {
        const { _id, groups } = req.body;
        if (!_id || !Array.isArray(groups)) {
            return res.status(400).send('Missing schedule ID or groups array');
        }
        await currentScheduleModel_1.default.findByIdAndUpdate(_id, { groups });
        res.send('✅ Schedule updated');
    }
    catch (err) {
        console.error('❌ Failed to update current schedule:', err);
        res.status(500).send('Server error');
    }
};
exports.updateCurrentSchedule = updateCurrentSchedule;
