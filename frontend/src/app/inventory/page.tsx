'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import EditCharacterInfo from './EditCharacterInfo';
import EditCharacterAbilities from './EditCharacterAbilities';
import CharacterCard from './CharacterCard';
import styles from './Styles/CharacterPage.module.css';
import { Character } from '../types';

type Role = 'DPS' | 'Healer' | 'Tank';
type RolePlusAll = Role | 'All';
type EditMode = 'info' | 'abilities' | null;

export default function CharacterPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);

  // single‐choice via checkboxes
  const [selectedRole, setSelectedRole] = useState<RolePlusAll>('All');

  useEffect(() => {
    api.get('/characters')
      .then(res => {
        const sanitized = res.data.map((c: Character) => ({
          ...c,
          abilities: c.abilities ?? {},
        }));
        setCharacters(sanitized);
      })
      .catch(err => console.error('❌ Failed to load:', err));
  }, []);

  const handleSave = (updatedChar: Character): void => {
    api.put(`/characters/${updatedChar._id}`, updatedChar)
      .then(() => api.get('/characters'))
      .then(res => {
        const sanitized = res.data.map((c: Character) => ({
          ...c,
          abilities: c.abilities ?? {},
        }));
        setCharacters(sanitized);
        setEditingChar(null);
        setEditMode(null);
        alert('✅ 保存成功');
      })
      .catch(err => {
        console.error(err);
        alert('❌ 保存失败');
      });
  };

  // clicking any checkbox selects that role; clicking it again resets to 'All'
  const selectRole = (role: RolePlusAll) => {
    setSelectedRole(prev => prev === role ? 'All' : role);
  };

  const filtered = characters.filter(char =>
    selectedRole === 'All' || char.role === selectedRole
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>角色管理</h1>

      {/* Single‐choice checkboxes */}
      <div className={styles.filterRow}>
        {(['All', 'DPS', 'Healer', 'Tank'] as RolePlusAll[]).map(role => (
          <label key={role} className={styles.filterLabel}>
            <input
              type="checkbox"
              checked={selectedRole === role}
              onChange={() => selectRole(role)}
            />
            {role}
          </label>
        ))}
      </div>

      {!editingChar ? (
        <div className={styles.cardGrid}>
          {filtered.map(char => (
            <CharacterCard
              key={char._id ?? char.name}
              character={char}
              onEditInfo={() => { setEditingChar(char); setEditMode('info'); }}
              onEditAbilities={() => { setEditingChar(char); setEditMode('abilities'); }}
            />
          ))}
        </div>
      ) : editMode === 'info' ? (
        <EditCharacterInfo
          character={editingChar}
          onSave={handleSave}
          onCancel={() => { setEditingChar(null); setEditMode(null); }}
        />
      ) : (
        <div className={styles.modalOverlay} onClick={() => { setEditingChar(null); setEditMode(null); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => { setEditingChar(null); setEditMode(null); }}>✖</button>
            <EditCharacterAbilities
              character={editingChar}
              onSave={handleSave}
              onCancel={() => { setEditingChar(null); setEditMode(null); }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
