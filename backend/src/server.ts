// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import characterRoutes from './routes/characterRoutes';
import groupRoutes from './routes/groupRoutes';

const app = express(); // ✅ declare app first
const PORT = 5000;    // ✅ use a different port than frontend

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/groups', groupRoutes);
// ✅ MongoDB connection
mongoose.connect(
  'mongodb+srv://zhibinren79:xIF0wEyWZ55rEvS3@cluster0.sedw7v9.mongodb.net/baizhan?retryWrites=true&w=majority&appName=Cluster0'
)


.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection failed', err));

// ✅ Routes
app.use('/api/characters', characterRoutes);

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

