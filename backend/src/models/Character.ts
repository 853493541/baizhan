// src/models/Character.ts
import mongoose from 'mongoose';

export interface CharacterDoc extends mongoose.Document {
  name: string;
  abilities: {
    [abilityName: string]: number;
  };
}

const characterSchema = new mongoose.Schema<CharacterDoc>({
  name: { type: String, required: true },
  abilities: {
    type: Map,
    of: Number,
    default: {}
  }
});

const Character = mongoose.model<CharacterDoc>('Character', characterSchema, 'JX3');

export default Character;
