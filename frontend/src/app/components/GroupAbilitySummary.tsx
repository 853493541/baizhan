'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';
import type { Character } from '../types';
import api from '../utils/api';
import GroupAbilityBox from './GroupAbilityBox';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  allCharacters: Character[];
  showLevels: boolean;
  showContributors: boolean;
}

export default function GroupAbilitySummary({
  groups,
  setGroups,
  allCharacters,
  showLevels,
  showContributors,
}: Props) {
  const [suggestingIndex, setSuggestingIndex] = useState<number | null>(null);

  const handleAddToGroup = async (groupIndex: number, char: Character) => {
    const updated = groups.map((g) => g.filter((c) => c._id !== char._id));
    updated[groupIndex] = [...updated[groupIndex], char];
    setGroups(updated);
    setSuggestingIndex(null);

    try {
      const payload = updated.map((group) =>
        group.map((c) => ({
          _id: c._id,
          name: c.name,
          account: c.account,
          role: c.role,
          class: c.class,
          abilities: {
            core: { ...(c.abilities?.core || {}) },
            healing: { ...(c.abilities?.healing || {}) },
          },
        }))
      );
      await api.post('/groups', payload);
    } catch (err) {
      console.error('❌ Failed to save groups on click:', err);
    }
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => (
        <GroupAbilityBox
          key={index}
          index={index}
          group={group}
          allCharacters={allCharacters}
          showLevels={showLevels}
          showContributors={showContributors}
          suggestingIndex={suggestingIndex}
          onSuggestClick={() =>
            setSuggestingIndex((prev) => (prev === index ? null : index))
          }
          onSelectSuggestion={(char) => handleAddToGroup(index, char)}
        />
      ))}
    </div>
  );
}
