// components/SuggestionModal.tsx
'use client';

import React from 'react';
import styles from './Styles/SuggestionModal.module.css';
import { Character } from '../types';
import { getValidSuggestions } from '../playground/filterSuggestions';
import { getFilteredNeeds } from '../playground/filterSkills';

interface SkillToggle {
  [key: string]: boolean;
}

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
  const suggestions = getValidSuggestions(allCharacters, currentGroup);

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

  const renderDisplay = (char: Character) => {
    if (viewMode === 'name') return `${char.comboBurst ? '@' : ''}${char.name}`;

    if (viewMode === 'core') {
      if (!char.core) return '(无技能)';
      const visibleCore = Object.entries(char.core).filter(([skill]) => skillToggle[skill]);
      return visibleCore.length > 0
        ? visibleCore.map(([k, v]) => (showLevels ? `${v}${k}` : k)).join('  ')
        : '(无技能)';
    }

    if (viewMode === 'needs') {
      const visibleNeeds = getFilteredNeeds(char.needs, skillToggle);
      return visibleNeeds.length > 0 ? visibleNeeds.join(' ') : '无需求';
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
