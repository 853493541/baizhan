'use client';

import React from 'react';
import styles from '../page.module.css';
import type { Character } from '../types';

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

export default function Checkboxes({ group }: { group: Character[] }) {
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
}
