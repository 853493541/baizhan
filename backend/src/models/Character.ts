import mongoose from 'mongoose';

export interface CharacterDoc extends mongoose.Document {
  name: string;
  account: string;
  role: string;
  class: string;
  owner: string;
  abilities: {
    core: { [key: string]: number };
    healing: { [key: string]: number };
  };
}

const characterSchema = new mongoose.Schema<CharacterDoc>({
  name: { type: String, required: true },
  account: { type: String, required: true },
  role: { type: String, required: true },
  class: { type: String, required: true },
  owner: { type: String, required: true },
  abilities: {
    core: { type: Map, of: Number, default: {} },
    healing: { type: Map, of: Number, default: {} }
  }
});

const Character =
  mongoose.models.Character || mongoose.model<CharacterDoc>('Character', characterSchema, 'JX3');

export default Character;
