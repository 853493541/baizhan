import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  name: String,
  account: String,
  owner: String,
  role: String,
  class: String,
  comboBurst: Boolean,
  core: { type: Map, of: Number },
  needs: [String]
}, { _id: false });

const ActiveSchedulingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groups: { type: [[CharacterSchema]], required: true },
  createdAt: { type: Date, default: Date.now }
});

const ActiveScheduling = mongoose.models.ActiveScheduling ||
  mongoose.model("ActiveScheduling", ActiveSchedulingSchema, "activeScheduling");

export default ActiveScheduling;

