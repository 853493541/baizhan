'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';
import styles from './Styles/page.module.css';
import AvailableCharacters from './AvailableCharacters';
import GroupCharts from './GroupCharts';
import GroupAbilitySummary from './GroupAbilitySummary';
import type { Character } from './types';

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
    Promise.all([
      api.get('/characters'),
      api.get('/groups'),
    ])
      .then(([charRes, groupRes]) => {
        const all = charRes.data as Character[];
        const map = new Map(all.map((c) => [c._id, c]));

        const sortedGroups = (groupRes.data as GroupDoc[])
          .sort((a, b) => a.groupIndex - b.groupIndex)
          .map((g) =>
            g.characters.map((c) => map.get(c._id) || c)
          );

        setAllCharacters(all);
        setGroups(sortedGroups);
      })
      .catch((err) => console.error('Failed to fetch data:', err));
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
      <h1 className={styles.title}>百战排表</h1>

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

      <h2 className={styles.subheading}>技能表</h2>
      <div className={styles.groups}>
        <GroupAbilitySummary
          groups={groups}
          setGroups={setGroups}
          allCharacters={allCharacters} // ✅ this line fixes the error
        />
      </div>
    </div>
  );
}
