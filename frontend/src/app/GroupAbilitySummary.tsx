'use client';

import styles from './Styles/page.module.css';
import type { Character } from './types';
import { getEffectiveAbilities } from './utils/abilityUtils';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  showLevel: boolean;
  showContributor: boolean;
}

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

const CORE_ABILITIES = ['花钱', '斗转', '天诛', '黑煞', '引燃'];
const CORE_SHORT = ['花', '斗', '天', '黑', '引'];

const getContributors = (core: Record<string, number>): string[] => {
  return CORE_ABILITIES
    .filter((ability) => (core?.[ability] || 0) < 9)
    .map((ability) => simplifyAbilityName(ability));
};

export default function GroupAbilitySummary({
  groups,
  setGroups,
  showLevel,
  showContributor,
}: Props) {
  const handleDrop = (groupIndex: number, char: Character) => {
    const updated = groups.map((g) => g.filter((c) => c._id !== char._id));
    updated[groupIndex] = [...updated[groupIndex], char];
    setGroups(updated);
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => {
        const groupContributors = new Set<string>();

        group.forEach((char) => {
          const coreRaw = typeof char.abilities?.core === 'object' ? char.abilities.core : {};
          const contribs = getContributors(coreRaw);
          contribs.forEach((c) => groupContributors.add(c));
        });

        return (
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
              const coreRaw = typeof char.abilities?.core === 'object' ? char.abilities.core : {};
              const effectiveCore = getEffectiveAbilities(coreRaw);

              let displayText = '';
              if (showContributor) {
                const contributors = getContributors(coreRaw);
                displayText = contributors.length > 0 ? contributors.join(' ') : '(none)';
              } else {
                displayText =
                  Object.entries(effectiveCore)
                    .map(([key, level]) =>
                      showLevel ? `${level}${simplifyAbilityName(key)}` : simplifyAbilityName(key)
                    )
                    .join(' ') || '(none)';
              }

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
                  {displayText}
                </div>
              );
            })}

            {showContributor && (
              <div className={styles.contributorChecklist}>
                {CORE_SHORT.map((abbr) => (
                  <span
                    key={abbr}
                    className={
                      groupContributors.has(abbr)
                        ? styles.boxChecked
                        : styles.boxEmpty
                    }
                  >
                    {abbr}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
