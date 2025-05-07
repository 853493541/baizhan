// src/app/types.ts
export type Character = {
  _id?: string;
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: {
    core: { [key: string]: number };
    healing: { [key: string]: number };
  };
  comboBurst?: boolean; // ✅ NEW FIELD
};
