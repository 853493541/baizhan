// src/app/playground/AvailableCharacters.tsx
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
  characters: Character[];
  onDragStart: (e: React.DragEvent, char: Character) => void;
  viewMode: ViewMode;
  showLevels: boolean;
}

export default function AvailableCharacters({
  characters,
  onDragStart,
  viewMode,
  showLevels,
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
    <div className={styles.availableGrid}>
      {characters.map((char, i) => (
        <div
          key={i}
          className={`${styles.charPill} ${getRoleClass(char.role)}`}
          draggable
          onDragStart={(e) => onDragStart(e, char)}
        >
          {renderDisplay(char)}
        </div>
      ))}
    </div>
  );
}
