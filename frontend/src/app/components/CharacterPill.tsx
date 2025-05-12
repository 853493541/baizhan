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

const CORE_ABILITIES = ['钱', '斗', '天', '黑', '引'];

const getContributors = (char: Character): string[] => {
  const core = Object.entries(char.abilities?.core || {}).filter(
    ([_, lvl]) => lvl >= 9
  );
  const healing = Object.entries(char.abilities?.healing || {}).filter(
    ([_, lvl]) => lvl >= 9
  );

  const owned = [...core, ...healing].map(([k]) => simplifyAbilityName(k));
  const ownedSet = new Set(owned);

  return CORE_ABILITIES.filter((ab) => !ownedSet.has(ab));
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
  const getColorClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'healer': return styles.pinkBox;
      case 'dps': return styles.greenBox;
      case 'tank': return styles.goldBox;
      default: return styles.defaultBox;
    }
  };

  const core = char.abilities?.core || {};
  const text = showContributors
    ? (() => {
        const missing = getContributors(char);
        return missing.length > 0 ? missing.join(' ') : '无';
      })()
    : Object.entries(core)
        .map(([key, level]) =>
          showLevels ? `${level}${simplifyAbilityName(key)}` : simplifyAbilityName(key)
        )
        .join(' ') || '无';

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
