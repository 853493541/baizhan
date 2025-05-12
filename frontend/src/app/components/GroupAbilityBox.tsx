'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';
import type { Character } from '../types';
import CharacterPill from './CharacterPill';
import Checkboxes from './Checkboxes';

interface Props {
  index: number;
  group: Character[];
  allCharacters: Character[];
  showLevels: boolean;
  showContributors: boolean;
  suggestingIndex: number | null;
  onSuggestClick: () => void;
  onSelectSuggestion: (char: Character) => void;
}

const CORE_ABILITIES = ['钱', '斗', '天', '黑', '引'];

function normalizeAbility(name: string): string {
  if (name.startsWith('花') || name.startsWith('钱')) return '钱';
  if (name.startsWith('斗')) return '斗';
  if (name.startsWith('天')) return '天';
  if (name.startsWith('黑')) return '黑';
  if (name.startsWith('引')) return '引';
  return name;
}

export default function GroupAbilityBox({
  index,
  group,
  allCharacters,
  showLevels,
  showContributors,
  suggestingIndex,
  onSuggestClick,
  onSelectSuggestion,
}: Props) {
  const [showNames, setShowNames] = useState(true);

  const getFilteredCharacters = (): Character[] => {
    const accountsInGroup = new Set(group.map((c) => c.account));
    const hasHealer = group.some((c) => c.role === 'Healer');

    let filtered = allCharacters.filter((char) => !accountsInGroup.has(char.account));

    if (group.length === 0) {
      const dps = filtered.filter((c) => c.role === 'DPS');
      if (dps.length > 0) return dps;
      const tanks = filtered.filter((c) => c.role === 'Tank');
      return tanks;
    }

    if (!hasHealer) {
      return filtered.filter((c) => c.role === 'Healer');
    } else {
      return filtered.filter((c) => c.role !== 'Healer');
    }
  };

  const getMissingAbilities = (char: Character): string[] => {
    const owned = [
      ...Object.entries(char.abilities?.core || {})
        .filter(([_, lvl]) => lvl >= 9)
        .map(([k]) => normalizeAbility(k)),
      ...Object.entries(char.abilities?.healing || {})
        .filter(([_, lvl]) => lvl >= 9)
        .map(([k]) => normalizeAbility(k)),
    ];
    const ownedSet = new Set(owned);
    return CORE_ABILITIES.filter((ab) => !ownedSet.has(ab));
  };

  const getRoleBoxClass = (role: string): string => {
    const normalized = role.toLowerCase();
    if (normalized === 'tank') return styles.goldBox;
    if (normalized === 'dps') return styles.greenBox;
    if (normalized === 'healer') return styles.pinkBox;
    return '';
  };

  return (
    <div className={styles.groupBox}>
      <h3>组 {index + 1}</h3>

      {group.map((char) => (
        <CharacterPill
          key={char._id}
          char={char}
          showLevels={showLevels}
          showContributors={showContributors}
        />
      ))}

      {showContributors && (
        <div className={styles.bottomRow}>
          <div style={{ position: 'relative' }}>
            <button className={styles.suggestButton} onClick={onSuggestClick}>
              ＋
            </button>

            {suggestingIndex === index && (
              <div className={styles.suggestionPopup}>
                <button
                  className={styles.toggleButton}
                  onClick={() => setShowNames((prev) => !prev)}
                >
                  {showNames ? '显示贡献技能' : '显示角色名字'}
                </button>
                <div className={styles.suggestionList}>
                  {getFilteredCharacters().map((char) => {
                    const roleClass = getRoleBoxClass(char.role);
                    const fullClass = `${styles.characterText} ${roleClass}`;
                    const text = showNames
                      ? char.name
                      : getMissingAbilities(char).join(' ');
                    return (
                      <div
                        key={char._id}
                        className={styles.suggestionItem}
                        onClick={() => onSelectSuggestion(char)}
                      >
                        <div className={fullClass}>{text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Checkboxes group={group} />
        </div>
      )}
    </div>
  );
}
