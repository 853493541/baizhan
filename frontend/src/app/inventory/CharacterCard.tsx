'use client';

import styles from './Styles/CharacterCard.module.css';
import { Character } from '../types';

type Props = {
  character: Character;
  onEditInfo: (char: Character) => void;
  onEditAbilities: (char: Character) => void;
};

export default function CharacterCard({ character, onEditInfo, onEditAbilities }: Props) {
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'DPS':
        return styles.greenBox;  // ← DPS is now green
      case 'Healer':
        return styles.pinkBox;
      case 'Tank':
        return styles.goldBox;   // ← Tank is now gold
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.card} ${getRoleClass(character.role)}`}>
      <div className={styles.cardTopRow}>
        <div className={styles.cardTitle}>{character.name}</div>
        <div className={styles.accountInfo}>
          账号:{character.account}
          <button onClick={() => onEditInfo(character)}>⚙️</button>
        </div>
      </div>

      <div className={styles.cardBottomRow}>
        <div className={styles.abilityAndButton}>
          <div className={styles.abilityText}>
            {Object.entries(character.abilities)
              .map(([k, v]) => `${v}${k}`)
              .join(' ')}
          </div>
          <button className={styles.editBtn} onClick={() => onEditAbilities(character)}>
            ✏️ 编辑技能
          </button>
        </div>
      </div>
    </div>
  );
}
