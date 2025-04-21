'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';
import EditCharacterInfo from './EditCharacterInfo';
import EditCharacterAbilities from './EditCharacterAbilities';
import styles from './Styles/CharacterPage.module.css';

type Character = {
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: { [key: string]: number };
};

type EditMode = 'info' | 'abilities' | null;

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);

  useEffect(() => {
    api
      .get('/characters')
      .then((res) => {
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
      setEditMode(null);
    } catch (err) {
      alert('❌ 保存失败');
      console.error(err);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>角色管理</h1>

      {!editingChar ? (
        <div className={styles.cardGrid}>
          {characters.map((char) => (
            <div key={char.name} className={styles.card}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>
                  {char.name} {char.role} {char.class}
                </div>
                <div className={styles.accountInfo}>
                  账号:{char.account}
                  <button
                    onClick={() => {
                      setEditingChar(char);
                      setEditMode('info');
                    }}
                  >
                    <span className="text-lg">⚙️</span>
                  </button>
                </div>
              </div>

              <div className={styles.abilityText}>
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
                className={styles.editBtn}
                onClick={() => {
                  setEditingChar(char);
                  setEditMode('abilities');
                }}
              >
                ✏️ 编辑技能
              </button>
            </div>
          ))}
        </div>
      ) : editMode === 'info' ? (
        <EditCharacterInfo
          character={editingChar}
          onSave={handleSave}
          onCancel={() => {
            setEditingChar(null);
            setEditMode(null);
          }}
        />
      ) : (
        <EditCharacterAbilities
          character={editingChar}
          onSave={handleSave}
          onCancel={() => {
            setEditingChar(null);
            setEditMode(null);
          }}
        />
      )}
    </main>
  );
}
