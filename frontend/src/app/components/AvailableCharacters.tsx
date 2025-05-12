'use client';

import styles from '../page.module.css';
import type { Character } from '../types';
import { useState } from 'react';

interface Props {
  characters: Character[];
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  showNames: boolean;
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

const getContributors = (char: Character): string[] => {
  const coreEntries = Object.entries(char.abilities?.core || {}).filter(
    ([_, level]) => level >= 9
  );
  const healingEntries = Object.entries(char.abilities?.healing || {}).filter(
    ([_, level]) => level >= 9
  );

  const owned = [...coreEntries, ...healingEntries].map(([k]) =>
    simplifyAbilityName(k)
  );

  const ownedSet = new Set(owned);
  return CORE_ABILITIES.filter((ab) => !ownedSet.has(ab));
};

export default function AvailableCharacters({ characters, groups, setGroups, showNames }: Props) {
  const [filter, setFilter] = useState<string>('ALL');

  const getColorClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'healer': return styles.pinkBox;
      case 'dps': return styles.greenBox;
      case 'tank': return styles.goldBox;
      default: return styles.defaultBox;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const char = JSON.parse(e.dataTransfer.getData('text/plain'));

    const updated = groups.map((g) =>
      g.filter((c) => c._id !== char._id)
    );

    setGroups(updated);
  };

  const filteredCharacters = characters.filter((char) => {
    if (filter === 'ALL') return true;
    return getContributors(char).includes(filter);
  });

  return (
    <>
      <div className={styles.buttonRow}>
        {['ALL', ...CORE_ABILITIES].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`${styles.button} ${filter === label ? styles.buttonGreen : ''}`}
          >
            {label === 'ALL' ? '全部' : label}
          </button>
        ))}
      </div>

      <div
        className={styles.characterList}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {filteredCharacters.map((char) => {
          const display = showNames
            ? (char.comboBurst ? `@${char.name}` : char.name)
            : getContributors(char).join(' ') || '无';

          console.debug('[DEBUG] Rendering char:', char.name, '| showNames:', showNames, '| display:', display);

          return (
            <div
              key={char._id}
              className={`${styles.characterCard} ${getColorClass(char.role)}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(char));
              }}
            >
              {display}
            </div>
          );
        })}
      </div>
    </>
  );
}
