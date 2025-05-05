'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';
import styles from './Styles/page.module.css';
import AvailableCharacters from './AvailableCharacters';
import GroupCharts from './GroupCharts';
import GroupAbilitySummary from './GroupAbilitySummary';

export type Character = {
  _id: string;
  name: string;
  account: string;
  role: string;
  class: string;
  abilities?: { [key: string]: number };
};

type GroupDoc = {
  groupIndex: number;
  characters: Character[];
};

export default function Page() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [groups, setGroups] = useState<Character[][]>(Array.from({ length: 8 }, () => []));

  useEffect(() => {
    api.get('/characters')
      .then((res) => setAllCharacters(res.data as Character[]))
      .catch((err) => console.error('Failed to fetch characters:', err));

    api.get('/groups')
      .then((res) => {
        const sorted = (res.data as GroupDoc[]).sort((a, b) => a.groupIndex - b.groupIndex);
        const restored = sorted.map((g) => g.characters);
        setGroups(restored);
      })
      .catch((err) => console.error('Failed to fetch groups:', err));
  }, []);

  const assignedIds = new Set(groups.flat().map((c) => c._id));
  const ungroupedCharacters = allCharacters.filter((c) => !assignedIds.has(c._id));

  const handleResetGroups = async () => {
    try {
      await api.delete('/groups');
      setGroups(Array.from({ length: 8 }, () => []));
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Group Scheduling - Iteration 3</h1>

      <button onClick={handleResetGroups} className={styles.button}>
        🗑 Reset All Groups
      </button>

      <AvailableCharacters
        characters={ungroupedCharacters}
        groups={groups}
        setGroups={setGroups}
      />

      <GroupCharts groups={groups} setGroups={setGroups} />

      <h2 style={{ marginTop: '2rem' }}>Ability Summary</h2>
      <GroupAbilitySummary groups={groups} setGroups={setGroups} />
    </div>
  );
}
