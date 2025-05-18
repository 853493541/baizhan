// components/SuggestionModal.tsx
'use client';

import React from 'react';
import styles from './Styles/SuggestionModal.module.css';
import { Character } from '../types';
import { getValidSuggestions, splitNeedsForDisplay } from '../playground/filterSuggestions';
import { SkillToggle } from '../playground/filterSkills';

interface Props {
  groupIndex: number;
  currentGroup: Character[];
  allCharacters: Character[];
  onSelect: (groupIndex: number, char: Character) => void;
  onClose: () => void;
  viewMode: 'name' | 'core' | 'needs';
  showLevels: boolean;
  skillToggle: SkillToggle;
}

export default function SuggestionModal({
  groupIndex,
  currentGroup,
  allCharacters,
  onSelect,
  onClose,
  viewMode,
  showLevels,
  skillToggle,
}: Props) {
  const suggestions = getValidSuggestions(allCharacters, currentGroup, skillToggle);

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'Tank':
        return styles.tank;
      case 'Healer':
        return styles.healer;
      case 'DPS':
        return styles.dps;
      default:
        return styles.defaultBox;
    }
  };

  const groupUnmet = ['钱', '斗', '天', '黑', '引'].filter((skill) => {
    const checked = currentGroup.some((c) => (c.needs || []).includes(skill) && skillToggle[skill]);
    return skillToggle[skill] && !checked;
  });

  const renderDisplay = (char: Character) => {
    if (viewMode === 'name') return `${char.comboBurst ? '@' : ''}${char.name}`;

    if (viewMode === 'core') {
      return '(略过核心展示)'; // core is not used for suggestion scoring
    }

    if (viewMode === 'needs') {
      const [contributing, others] = splitNeedsForDisplay(char, groupUnmet, skillToggle);
      if (contributing.length === 0 && others.length === 0) return '无需求';
      return contributing.join(' ') + (others.length ? ` | ${others.join(' ')}` : '');
    }

    return char.name;
  };

  return (
    <div className={styles.suggestBox}>
      <div className={styles.headerRow}>
        <span>建议 (组 {groupIndex + 1})</span>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.list}>
        {suggestions.map((char) => (
          <div
            key={char.name + char.account}
            className={`${styles.charPill} ${getRoleClass(char.role)}`}
            onClick={() => {
              onSelect(groupIndex, char);
              onClose();
            }}
          >
            {renderDisplay(char)}
          </div>
        ))}
      </div>
    </div>
  );
}
