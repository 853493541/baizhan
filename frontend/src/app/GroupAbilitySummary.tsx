'use client';

import React, { useState } from 'react';
import styles from './Styles/page.module.css';
import type { Character } from './types';
import { getEffectiveAbilities } from './utils/abilityUtils';
import api from './utils/api';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  allCharacters: Character[];
}

const simplifyAbilityName = (name: string): string => {
  if (name.startsWith('黑')) return '黑';
  if (name.startsWith('花')) return '花';
  if (name.startsWith('斗')) return '斗';
  if (name.startsWith('天')) return '天';
  if (name.startsWith('引')) return '引';
  return name;
};

const getColorClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'healer':
      return styles.pinkBox;
    case 'dps':
      return styles.greenBox;
    case 'tank':
      return styles.goldBox;
    default:
      return styles.defaultBox;
  }
};

export default function GroupAbilitySummary({ groups, setGroups, allCharacters }: Props) {
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
      const res = await api.post('/groups', payload);
      console.debug('✅ Saved groups after click:', res.status);
    } catch (err) {
      console.error('❌ Failed to save groups on click:', err);
    }
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => (
        <div key={index} className={styles.groupBox}>
          <h3>组 {index + 1}</h3>
          <button
            className={styles.suggestButton}
            onClick={() =>
              setSuggestingIndex((prev) => (prev === index ? null : index))
            }
          >
            建议角色
          </button>

          {group.map((char) => {
            const coreRaw =
              typeof char.abilities?.core === 'object' ? char.abilities.core : {};
            const effectiveCore = getEffectiveAbilities(coreRaw);
            const coreText =
              Object.entries(effectiveCore)
                .map(([key, level]) => `${level}${simplifyAbilityName(key)}`)
                .join(' ') || '(none)';

            return (
              <div
                key={char._id}
                className={`${styles.characterCard} ${getColorClass(char.role)}`}
                title={char.name}
              >
                {coreText}
              </div>
            );
          })}

          {suggestingIndex === index && (
            <div className={styles.suggestionBox}>
              {allCharacters.map((char) => {
                const coreRaw =
                  typeof char.abilities?.core === 'object'
                    ? char.abilities.core
                    : {};
                const effectiveCore = getEffectiveAbilities(coreRaw);
                const coreText =
                  Object.entries(effectiveCore)
                    .map(([key, level]) => `${level}${simplifyAbilityName(key)}`)
                    .join(' ') || '(none)';

                return (
                  <div
                    key={char._id}
                    className={`${styles.characterCard} ${getColorClass(char.role)}`}
                    onClick={() => handleAddToGroup(index, char)}
                    title={char.name}
                  >
                    {coreText}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
