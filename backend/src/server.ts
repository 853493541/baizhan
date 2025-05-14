import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app'; // ← your actual express app

dotenv.config();

const PORT = process.env.PORT || 5000;

// ⛳ Only run server after Mongoose connects
mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any).then(() => {
  console.log('🟢 Mongoose connected');

  mongoose.connection.on('connected', () => {
    console.log('✅ [MongoDB] Connection open');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔥 [MongoDB] Connection error:', err.message);
  });

  app.listen(PORT, () => {
    console.log(`🟢 Backend server running on port ${PORT}`);
  });

}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});
