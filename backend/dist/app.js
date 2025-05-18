"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const characterRoutes_1 = __importDefault(require("./routes/characterRoutes"));
const activeSchedulingRoutes_1 = __importDefault(require("./routes/activeSchedulingRoutes"));
const currentScheduleRoutes_1 = __importDefault(require("./routes/currentScheduleRoutes"));
const historyRoutes_1 = __importDefault(require("./routes/historyRoutes")); // Optional — only if you're still using it
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/characters', characterRoutes_1.default);
app.use('/api/active-scheduling', activeSchedulingRoutes_1.default);
app.use('/api/current-schedule', currentScheduleRoutes_1.default);
app.use('/api/history', historyRoutes_1.default); // remove if not needed
exports.default = app;
