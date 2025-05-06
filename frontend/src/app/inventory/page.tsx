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

const roleLabels: { [key in RolePlusAll]: string } = {
  All: '全部',
  DPS: '输出',
  Healer: '治疗',
  Tank: 'T',
};

const ownerLabels: { [key: string]: string } = {
  All: '全部',
  CatCatCake: '猫猫糕',
  SquareHouse: '东海甜妹',
  Orange: '桔子',
};

export default function CharacterPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);

  const [selectedRole, setSelectedRole] = useState<RolePlusAll>('All');
  const [ownerFilter, setOwnerFilter] = useState<string>('All');

  useEffect(() => {
    const query: string[] = [];
    if (ownerFilter !== 'All') query.push(`owner=${encodeURIComponent(ownerFilter)}`);
    const queryStr = query.length > 0 ? `?${query.join('&')}` : '';

    api.get(`/characters${queryStr}`)
      .then(res => {
        const sanitized = res.data.map((c: Character) => ({
          ...c,
          abilities: c.abilities ?? {},
        }));
        setCharacters(sanitized);
      })
      .catch(err => console.error('❌ Failed to load:', err));
  }, [ownerFilter]);

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

  const selectRole = (role: RolePlusAll) => {
    setSelectedRole(prev => prev === role ? 'All' : role);
  };

  const selectOwner = (owner: string) => {
    setOwnerFilter(prev => prev === owner ? 'All' : owner);
  };

  const filtered = characters.filter(char =>
    (selectedRole === 'All' || char.role === selectedRole)
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>角色管理</h1>

      {/* Role Filter */}
      <div className={styles.filterRow}>
        <strong>定位:</strong>
        {(Object.keys(roleLabels) as RolePlusAll[]).map(role => (
          <label key={role} className={styles.filterLabel}>
            <input
              type="checkbox"
              checked={selectedRole === role}
              onChange={() => selectRole(role)}
            />
            {roleLabels[role]}
          </label>
        ))}
      </div>

      {/* Owner Filter */}
      <div className={styles.filterRow}>
        <strong>玩家:</strong>
        {Object.keys(ownerLabels).map(owner => (
          <label key={owner} className={styles.filterLabel}>
            <input
              type="checkbox"
              checked={ownerFilter === owner}
              onChange={() => selectOwner(owner)}
            />
            {ownerLabels[owner]}
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
