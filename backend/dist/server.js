"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const characterRoutes_1 = __importDefault(require("./routes/characterRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const app = (0, express_1.default)(); // ✅ declare app first
const PORT = 5000; // ✅ use a different port than frontend
// ✅ Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/groups', groupRoutes_1.default);
// ✅ MongoDB connection
mongoose_1.default.connect('mongodb+srv://zhibinren79:xIF0wEyWZ55rEvS3@cluster0.sedw7v9.mongodb.net/baizhan?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection failed', err));
// ✅ Routes
app.use('/api/characters', characterRoutes_1.default);
// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
