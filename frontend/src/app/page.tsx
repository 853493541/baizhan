'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';

type Character = {
  name: string;
  abilities: { [key: string]: number };
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ability, setAbility] = useState('');
  const [level, setLevel] = useState<number>(0);

  // Load character list on mount
  useEffect(() => {
    api.get('/characters')
      .then((res) => {
        console.log('🧠 Characters:', res.data); // debug
        setCharacters(res.data);
      })
      .catch((err) => console.error('❌ Fetch failed:', err));
  }, []);

  // Update ability
  const updateAbility = async () => {
    if (!selected || !ability) return;
    try {
      await api.put(`/characters/${selected}`, { ability, level });
      alert('✅ Ability updated!');
      // Refresh list
      const updated = await api.get('/characters');
      setCharacters(updated.data);
    } catch (err) {
      alert('❌ Update failed');
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🧙 Characters</h1>

      <ul className="space-y-4 mb-6">
        {characters.map((char) => (
          <li key={char.name} className="border p-4 rounded shadow-sm">
            <div className="font-semibold text-lg">{char.name}</div>
            <div className="text-sm text-gray-700 mt-1">
              {Object.entries(char.abilities)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </div>
            <button
              className="mt-2 text-blue-600 hover:underline"
              onClick={() => setSelected(char.name)}
            >
              ✏️ Edit
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Edit {selected}</h2>
          <div className="flex gap-2 mb-2">
            <input
              placeholder="Ability 名字"
              className="border p-1 px-2 rounded w-40"
              onChange={(e) => setAbility(e.target.value)}
            />
            <input
              type="number"
              placeholder="Level 等级"
              className="border p-1 px-2 rounded w-24"
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={updateAbility}
          >
            ✅ Update
          </button>
        </div>
      )}
    </main>
  );
}
