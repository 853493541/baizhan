'use client';

import React, { useState, useEffect } from 'react';
import styles from './Styles/page.module.css';
import type { Character } from './types';
import { getEffectiveAbilities } from './utils/abilityUtils';
import api from './utils/api';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  allCharacters: Character[];
  showLevels: boolean;
  showContributors: boolean;
}

const CORE_ABILITIES = ['钱', '斗', '天', '黑', '引'];

const simplifyAbilityName = (name: string): string => {
  if (name.startsWith('花') || name.startsWith('钱')) return '钱';
  if (name.startsWith('斗')) return '斗';
  if (name.startsWith('天')) return '天';
  if (name.startsWith('黑')) return '黑';
  if (name.startsWith('引')) return '引';
  return name[0];
};

const getContributors = (core: Record<string, number> = {}) => {
  const rawKeys = Object.keys(core);
  const owned = rawKeys
    .filter((key) => core[key] >= 9) // ✅ only level 9 and 10 count
    .map(simplifyAbilityName);

  const ownedSet = new Set(owned);
  const missing = CORE_ABILITIES.filter((abbr) => !ownedSet.has(abbr));

  console.log('🧠 Contributor DEBUG ↓↓↓');
  console.log('→ Raw core:', core);
  console.log('→ Raw keys:', rawKeys);
  console.log('→ Simplified owned (9+):', owned);
  console.log('→ Missing:', missing);

  return missing;
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

export default function GroupAbilitySummary({
  groups,
  setGroups,
  allCharacters,
  showLevels,
  showContributors,
}: Props) {
  const [suggestingIndex, setSuggestingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('📦 Component mounted');
    console.log('➡️ Props:', { groups, allCharacters, showLevels, showContributors });
  }, []);

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

  const renderAbilityText = (char: Character) => {
    const coreRaw = char.abilities?.core || {};
    const effectiveCore = getEffectiveAbilities(coreRaw);

    if (showContributors) {
      const missing = getContributors(coreRaw);
      console.log(`👤 Contributor view for: ${char.name}`);
      return missing.length > 0 ? missing.join(' ') : '(无缺)';
    }

    console.log(`👤 Ability view for: ${char.name}`, effectiveCore);
    return Object.entries(effectiveCore)
      .map(([key, level]) =>
        showLevels
          ? `${level}${simplifyAbilityName(key)}`
          : simplifyAbilityName(key)
      )
      .join(' ') || '(none)';
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => {
        console.log(`📂 Rendering group ${index + 1} with ${group.length} characters`);
        return (
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

            {group.map((char) => (
              <div
                key={char._id}
                className={`${styles.characterCard} ${getColorClass(char.role)}`}
                title={char.name}
              >
                {renderAbilityText(char)}
              </div>
            ))}

            {suggestingIndex === index && (
              <div className={styles.suggestionBox}>
                {allCharacters.map((char) => (
                  <div
                    key={char._id}
                    className={`${styles.characterCard} ${getColorClass(char.role)}`}
                    onClick={() => handleAddToGroup(index, char)}
                    title={char.name}
                  >
                    {renderAbilityText(char)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
