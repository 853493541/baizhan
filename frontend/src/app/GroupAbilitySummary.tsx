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

const getCharacterContributors = (core: Record<string, number> = {}): string[] => {
  const owned = Object.entries(core)
    .filter(([, level]) => level >= 9)
    .map(([key]) => simplifyAbilityName(key));

  const ownedSet = new Set(owned);
  return CORE_ABILITIES.filter((abbr) => !ownedSet.has(abbr));
};

const getGroupContributors = (group: Character[]): Set<string> => {
  const contributors = new Set<string>();
  for (const char of group) {
    const missing = getCharacterContributors(char.abilities?.core || {});
    missing.forEach((abbr) => contributors.add(abbr));
  }
  return contributors;
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

  const renderAbilityText = (char: Character) => {
    const coreRaw = char.abilities?.core || {};
    const effectiveCore = getEffectiveAbilities(coreRaw);

    if (showContributors) {
      const missing = getCharacterContributors(coreRaw);
      return missing.length > 0 ? missing.join(' ') : '(无缺)';
    }

    return Object.entries(effectiveCore)
      .map(([key, level]) =>
        showLevels
          ? `${level}${simplifyAbilityName(key)}`
          : simplifyAbilityName(key)
      )
      .join(' ') || '(none)';
  };

  const renderGroupContributors = (group: Character[]) => {
    const contributorSet = getGroupContributors(group);
    return (
      <div className={styles.coverageRow}>
        {CORE_ABILITIES.map((abbr) => (
          <span
            key={abbr}
            className={
              contributorSet.has(abbr)
                ? styles.coveragePillCovered
                : styles.coveragePillMissing
            }
          >
            {abbr}
          </span>
        ))}
      </div>
    );
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

          {group.map((char) => (
            <div
              key={char._id}
              className={`${styles.characterCard} ${getColorClass(char.role)}`}
              title={char.name}
            >
              {renderAbilityText(char)}
            </div>
          ))}

          {showContributors && renderGroupContributors(group)}

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
      ))}
    </div>
  );
}
