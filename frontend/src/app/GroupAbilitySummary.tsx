'use client';

import styles from './Styles/page.module.css';
import type { Character } from './types';
import { getEffectiveAbilities } from './utils/abilityUtils';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
}

// Simplify names (e.g., 黑煞 → 黑)
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

export default function GroupAbilitySummary({ groups, setGroups }: Props) {
  const handleDrop = (groupIndex: number, char: Character) => {
    const updated = groups.map((g) => g.filter((c) => c._id !== char._id));
    updated[groupIndex] = [...updated[groupIndex], char];
    setGroups(updated);
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => (
        <div
          key={index}
          className={styles.groupBox}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const char = JSON.parse(e.dataTransfer.getData('text/plain'));
            handleDrop(index, char);
          }}
        >
          <h3>组 {index + 1}</h3>
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
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(char));
                }}
                title={`Drag ${char.name} to another group`}
              >
                {coreText}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
