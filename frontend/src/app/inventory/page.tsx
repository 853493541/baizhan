'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import EditCharacterInfo from './EditCharacterInfo';
import EditCharacterAbilities from './EditCharacterAbilities';
import CharacterCard from './CharacterCard';
import styles from './Styles/CharacterPage.module.css';

type Role = 'DPS' | 'Healer' | 'Tank';
type RolePlusAll = Role | 'All';

type LocalCharacter = {
  _id?: string;
  name: string;
  role: string;
  account: string;
  owner: string;
  class: string;
  comboBurst: boolean;
  abilities: {
    core: { [key: string]: number };
    healing: { [key: string]: number };
  };
};

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
  const [characters, setCharacters] = useState<LocalCharacter[]>([]);
  const [editingChar, setEditingChar] = useState<LocalCharacter | null>(null);
  const [editMode, setEditMode] = useState<'info' | 'abilities' | null>(null);
  const [selectedRole, setSelectedRole] = useState<RolePlusAll>('All');
  const [ownerFilter, setOwnerFilter] = useState<string>('All');

  const fetchCharacters = () => {
    api.get('/characters')
      .then(res => {
        const sanitized = res.data.map((c: any): LocalCharacter => ({
          ...c,
          abilities: {
            core: c.abilities?.core ?? {},
            healing: c.abilities?.healing ?? {},
          },
        }));
        setCharacters(sanitized);
      })
      .catch(err => console.error('❌ Failed to load:', err));
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const selectRole = (role: RolePlusAll) => {
    setSelectedRole(prev => (prev === role ? 'All' : role));
  };

  const selectOwner = (owner: string) => {
    setOwnerFilter(prev => prev === owner ? 'All' : owner);
  };

  const handleSave = (updatedChar: LocalCharacter): void => {
    api.put(`/characters/${updatedChar._id}`, updatedChar)
      .then(() => {
        fetchCharacters();
        setEditingChar(null);
        setEditMode(null);
        alert('✅ 保存成功');
      })
      .catch(err => {
        console.error(err);
        alert('❌ 保存失败');
      });
  };

  const filtered = characters.filter(char =>
    (selectedRole === 'All' || char.role === selectedRole) &&
    (ownerFilter === 'All' || char.owner === ownerFilter)
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>角色管理</h1>

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
              onCancel={() => { setEditingChar(null); setEditMode(null); }}
              onSave={() => {}} // ✅ now triggers refresh
            />
          </div>
        </div>
      )}
    </main>
  );
}
