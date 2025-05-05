import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  account: String,
  role: String,
  class: String,
  abilities: Object
}, { _id: false });

const groupSchema = new mongoose.Schema({
  week: { type: String, required: true },
  groupIndex: { type: Number, required: true },
  characters: [characterSchema]
});

export default mongoose.model('Group', groupSchema);
