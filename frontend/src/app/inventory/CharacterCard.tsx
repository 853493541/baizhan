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
        return styles.greenBox;
      case 'Healer':
        return styles.pinkBox;
      case 'Tank':
        return styles.goldBox;
      default:
        return '';
    }
  };

  const healingClasses = ['七秀', '五毒', '药宗', '长歌', '万花'];
  const showHealing = healingClasses.includes(character.class);

  const coreAbilities = Object.entries(character.abilities.core || {});
  const healingAbilities = showHealing ? Object.entries(character.abilities.healing || {}) : [];

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
            {coreAbilities.length > 0
              ? coreAbilities.map(([k, v]) => `${v}${k}`).join(' ')
              : '无技能'}
            {healingAbilities.length > 0 && <br />}
            {healingAbilities.length > 0 &&
              healingAbilities.map(([k, v]) => `${v}${k}`).join(' ')}
          </div>
          <button className={styles.editBtn} onClick={() => onEditAbilities(character)}>
            ✏️ 编辑技能
          </button>
        </div>
      </div>
    </div>
  );
}
