'use client';

import styles from './Styles/page.module.css';
import type { Character } from './page';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
}

export default function GroupAbilitySummary({ groups, setGroups }: Props) {
  const getColorClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'healer': return styles.pinkBox;
      case 'dps': return styles.greenBox;
      case 'tank': return styles.goldBox;
      default: return styles.defaultBox;
    }
  };

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
          <h3>Group {index + 1}</h3>
          {group.map((char) => {
            const abilityText = Object.entries(char.abilities || {})
              .map(([key, level]) => `${level}${key}`)
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
                {abilityText}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
