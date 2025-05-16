import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  _id: String,
  name: String,
  account: String,
  owner: String,
  role: { type: String, enum: ['DPS', 'Healer', 'Tank'] },
  comboBurst: Boolean,
  core: { type: Map, of: Number },
  needs: [String]
}, { _id: false });

const groupSchema = new mongoose.Schema({
  groupIndex: Number,
  completed: Boolean,
  note: String,
  characters: [characterSchema]
}, { _id: false });

const currentScheduleSchema = new mongoose.Schema({
  weekTag: String,
  createdAt: Date,
  groups: [groupSchema]
});

// 👇 force collection name to match exactly: "currentSchedule"
export default mongoose.models.currentSchedule ||
  mongoose.model('currentSchedule', currentScheduleSchema, 'currentSchedule');
