import mongoose from 'mongoose';

console.log('📦 [Model] Loading ActiveScheduling model...');

const CharacterSchema = new mongoose.Schema({
  name: String,
  account: String,
  owner: String,
  role: String,
  class: String,
  comboBurst: Boolean,
  abilities: {
    core: { type: Map, of: Number },
    healing: { type: Map, of: Number }
  }
}, { _id: false });

const ActiveSchedulingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groups: { type: [[CharacterSchema]], required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Force collection name and disable pluralization
const ActiveScheduling = mongoose.models.ActiveScheduling ||
  mongoose.model('ActiveScheduling', ActiveSchedulingSchema, 'activeScheduling');

console.log('✅ [Model] ActiveScheduling model registered');

export default ActiveScheduling;
