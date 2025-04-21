'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';
import CharacterEditor from './CharacterEditor';

type Character = {
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: { [key: string]: number };
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  // Load characters on mount
  useEffect(() => {
    api.get('/characters')
      .then((res) => {
        console.log('🧠 Characters:', res.data);
        setCharacters(res.data);
      })
      .catch((err) => console.error('❌ Failed to load characters:', err));
  }, []);

  const handleSave = async (updatedChar: Character) => {
    try {
      await api.put(`/characters/${updatedChar.name}`, updatedChar);
      alert('✅ 信息已保存!');
      const refreshed = await api.get('/characters');
      setCharacters(refreshed.data);
      setEditingChar(null);
    } catch (err) {
      alert('❌ 保存失败');
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">角色管理</h1>

      {!editingChar ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {characters.map((char) => (
            <div
              key={char.name}
              className="border rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <div className="text-xl font-semibold">{char.name}</div>
              <div className="text-gray-600 mt-1">账号: {char.account}</div>
              <div className="text-gray-600 mt-1">职业: {char.class}</div>
              <div className="text-gray-600 mt-1">定位: {char.role}</div>
              <div className="text-sm text-gray-800 mt-2">
                技能：
                {Object.entries(char.abilities).length > 0 ? (
                  Object.entries(char.abilities)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')
                ) : (
                  <span className="italic text-gray-400">无</span>
                )}
              </div>
              <button
                className="mt-3 text-blue-600 hover:underline"
                onClick={() => setEditingChar(char)}
              >
                ✏️ 编辑
              </button>
            </div>
          ))}
        </div>
      ) : (
        <CharacterEditor
          character={editingChar}
          onSave={handleSave}
          onCancel={() => setEditingChar(null)}
        />
      )}
    </main>
  );
}
