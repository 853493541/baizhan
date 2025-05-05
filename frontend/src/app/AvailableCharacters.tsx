'use client';

import styles from './Styles/page.module.css';
import type { Character } from './page';

interface Props {
  characters: Character[];
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
}

export default function AvailableCharacters({ characters, groups, setGroups }: Props) {
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

  return (
    <div
      className={styles.characterList}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {characters.map((char) => (
        <div
          key={char._id}
          className={`${styles.characterCard} ${getColorClass(char.role)}`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(char));
          }}
        >
          {char.name}
        </div>
      ))}
    </div>
  );
}
