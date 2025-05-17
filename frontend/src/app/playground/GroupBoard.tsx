// src/app/playground/GroupBoard.tsx
import React from 'react';
import styles from './Styles/page.module.css';

interface Character {
  name: string;
  role: string;
  account: string;
  owner: string;
  comboBurst: boolean;
  core?: Record<string, number>;
  needs?: string[];
}

type ViewMode = 'name' | 'core' | 'needs';

interface Props {
  groups: Character[][];
  viewMode: ViewMode;
  showLevels: boolean;
  onDrop: (e: React.DragEvent, groupIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemove: (groupIndex: number, charIndex: number, char: Character) => void;
  onDragStart: (e: React.DragEvent, char: Character, originGroupIndex: number) => void;
}

export default function GroupBoard({
  groups,
  viewMode,
  showLevels,
  onDrop,
  onDragOver,
  onRemove,
  onDragStart,
}: Props) {
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
      return Object.entries(char.core)
        .map(([k, v]) => (showLevels ? `${v}${k}` : k))
        .join('  ');
    }
    if (viewMode === 'needs') {
      if (!char.needs) return '(无需求)';
      return char.needs.length > 0 ? `${char.needs.join(' ')}` : '无需求';
    }
    return char.name;
  };

  return (
    <div className={styles.groupGrid}>
      {groups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={styles.groupCard}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, groupIndex)}
        >
          <h3>组 {groupIndex + 1}</h3>
          {group.map((char, i) => (
            <div
              key={i}
              className={`${styles.charPill} ${getRoleClass(char.role)}`}
              draggable
              onDragStart={(e) => onDragStart(e, char, groupIndex)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRemove(groupIndex, i, char);
              }}
            >
              {renderDisplay(char)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
