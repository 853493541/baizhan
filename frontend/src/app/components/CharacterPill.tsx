'use client';

import React from 'react';
import styles from '../page.module.css';
import type { Character } from '../types';

const simplifyAbilityName = (name: string): string => {
  if (name.startsWith('花') || name.startsWith('钱')) return '钱';
  if (name.startsWith('斗')) return '斗';
  if (name.startsWith('天')) return '天';
  if (name.startsWith('黑')) return '黑';
  if (name.startsWith('引')) return '引';
  return name[0];
};

interface Props {
  char: Character;
  showLevels: boolean;
  showContributors: boolean;
  onClick?: () => void;
}

export default function CharacterPill({
  char,
  showLevels,
  showContributors,
  onClick,
}: Props) {
  const core = char.abilities?.core || {};
  const owned = Object.entries(core)
    .filter(([, level]) => level >= 9)
    .map(([key]) => simplifyAbilityName(key));
  const ownedSet = new Set(owned);
  const missing = ['钱', '斗', '天', '黑', '引'].filter((a) => !ownedSet.has(a));

  const text = showContributors
    ? missing.length > 0 ? missing.join(' ') : '(无缺)'
    : Object.entries(core)
        .map(([key, level]) =>
          showLevels
            ? `${level}${simplifyAbilityName(key)}`
            : simplifyAbilityName(key)
        )
        .join(' ') || '(none)';

  const getColorClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'healer': return styles.pinkBox;
      case 'dps': return styles.greenBox;
      case 'tank': return styles.goldBox;
      default: return styles.defaultBox;
    }
  };

  return (
    <div
      className={`${styles.characterCard} ${getColorClass(char.role)}`}
      title={char.name}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
