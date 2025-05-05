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
  const [groups, setGroups] = useState<Character[][]>(
    Array.from({ length: 8 }, () => [])
  );

  useEffect(() => {
    api
      .get('/characters')
      .then((res) => setAllCharacters(res.data as Character[]))
      .catch((err) => console.error('Failed to fetch characters:', err));

    api
      .get('/groups')
      .then((res) => {
        const sorted = (res.data as GroupDoc[]).sort(
          (a, b) => a.groupIndex - b.groupIndex
        );
        setGroups(sorted.map((g) => g.characters));
      })
      .catch((err) => console.error('Failed to fetch groups:', err));
  }, []);

  const assignedIds = new Set(groups.flat().map((c) => c._id));
  const ungrouped = allCharacters.filter((c) => !assignedIds.has(c._id));

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
      {/* note: we added className={styles.title} here */}
      <h1 className={styles.title}>百战排表 – Iteration 4</h1>

      <div className={styles.buttonRow}>
        <a href="/inventory" className={styles.inventoryBox}>
          角色管理
        </a>
        <button onClick={handleResetGroups} className={styles.button}>
          全部重置
        </button>
      </div>

      <div className={styles.characterList}>
        <AvailableCharacters
          characters={ungrouped}
          groups={groups}
          setGroups={setGroups}
        />
      </div>

      <div className={styles.groups}>
        <GroupCharts groups={groups} setGroups={setGroups} />
      </div>

      <h2 className={styles.subheading}>Ability Summary</h2>
      <div className={styles.groups}>
        <GroupAbilitySummary groups={groups} setGroups={setGroups} />
      </div>
    </div>
  );
}
