"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app")); // ← your actual express app
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// ⛳ Only run server after Mongoose connects
mongoose_1.default.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('🟢 Mongoose connected');
    mongoose_1.default.connection.on('connected', () => {
        console.log('✅ [MongoDB] Connection open');
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('🔥 [MongoDB] Connection error:', err.message);
    });
    app_1.default.listen(PORT, () => {
        console.log(`🟢 Backend server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
});
