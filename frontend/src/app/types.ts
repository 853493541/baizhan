// src/app/types.ts
export type Character = {
  _id?: string;            // now optional
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: { [key: string]: number };
};
