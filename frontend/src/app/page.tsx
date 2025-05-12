/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import api from './utils/api';
import styles from './page.module.css';
import AvailableCharacters from './components/AvailableCharacters';
import GroupCharts from './components/GroupCharts';
import GroupAbilitySummary from './components/GroupAbilitySummary';
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
  const [showAbilityLevel, setShowAbilityLevel] = useState(true);
  const [showContributor, setShowContributor] = useState(false);

  const [showLevels, setShowLevels] = useState(false);
  const [summaryOnTop, setSummaryOnTop] = useState(true);
  const [showContributors, setShowContributors] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/characters'), api.get('/groups')])
      .then(([charRes, groupRes]) => {
        const all = charRes.data as Character[];
        const map = new Map(all.map((c) => [c._id, c]));

        const sortedGroups = (groupRes.data as GroupDoc[])
          .sort((a, b) => a.groupIndex - b.groupIndex)
          .map((g) => g.characters.map((c) => map.get(c._id) || c));

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
      <h1 className={styles.title}>百战排表 I7</h1>

      <div className={styles.buttonRow}>
        <a href="/inventory" className={styles.inventoryBox}>
          角色管理
        </a>
        <button onClick={handleResetGroups} className={styles.button}>
          全部重置
        </button>
        <button

          onClick={() => setShowLevels((v) => !v)}
          className={`${styles.button} ${styles.buttonGreen}`}
        >
          {showLevels ? '隐藏等级' : '显示等级'}
        </button>
        <button
          onClick={() => setSummaryOnTop((v) => !v)}
          className={`${styles.button} ${styles.buttonYellow}`}
        >
          {summaryOnTop ? '把技能表移到底部' : '把技能表移到顶部'}
        </button>
        <button
          onClick={() => setShowContributors((v) => !v)}
          className={`${styles.button} ${styles.buttonBlue}`}
        >
          {showContributors ? '隐藏贡献' : '显示贡献'}

        </button>
      </div>

      <div className={styles.characterList}>
        <AvailableCharacters
          characters={ungrouped}
          groups={groups}
          setGroups={setGroups}
        />
      </div>

      {summaryOnTop && (
        <>
          <h2 className={styles.subheading}>技能表</h2>
          <div className={styles.groups}>
            <GroupAbilitySummary
              groups={groups}
              setGroups={setGroups}
              allCharacters={allCharacters}
              showLevels={showLevels}
              showContributors={showContributors}
            />
          </div>
        </>
      )}

      <div className={styles.groups}>
        <GroupCharts groups={groups} setGroups={setGroups} />
      </div>

      {!summaryOnTop && (
        <>
          <h2 className={styles.subheading}>技能表</h2>
          <div className={styles.groups}>
            <GroupAbilitySummary
              groups={groups}
              setGroups={setGroups}
              allCharacters={allCharacters}
              showLevels={showLevels}
              showContributors={showContributors}
            />
          </div>
        </>
      )}

    </div>
  );
}
