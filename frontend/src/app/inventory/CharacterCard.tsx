'use client';

import styles from './Styles/CharacterCard.module.css';
import { getEffectiveAbilities } from '../utils/abilityUtils';

type Character = {
  name: string;
  role: string;
  account: string;
  owner: string;
  class: string;
  comboBurst: boolean;
  abilities?: {
    core?: Record<string, number>;
    healing?: Record<string, number>;
  };
};

type Props = {
  character: Character;
  onEditInfo: (char: Character) => void;
  onEditAbilities: (char: Character) => void;
};

const isHealerClass = (charClass: string) =>
  ['七秀', '五毒', '药宗', '长歌', '万花'].includes(charClass);

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

  const core = getEffectiveAbilities(character.abilities?.core ?? {});
  const healing = isHealerClass(character.class)
    ? getEffectiveAbilities(character.abilities?.healing ?? {})
    : {};

  return (
    <div className={`${styles.card} ${getRoleClass(character.role)}`}>
      <div className={styles.cardTopRow}>
        <div className={styles.cardTitle}>
          {character.comboBurst ? `@${character.name}` : character.name}
        </div>
        <div className={styles.accountInfo}>
          账号:{character.account}
          <button onClick={() => onEditInfo(character)}>⚙️</button>
        </div>
      </div>

      <div className={styles.cardBottomRow}>
        <div className={styles.abilityAndButton}>
          <div>
            <div className={styles.abilityText}>
              {Object.entries(core)
                .map(([name, level]) => `${level}${name}`)
                .join(' ')}
            </div>
            {Object.keys(healing).length > 0 && (
              <div className={styles.abilityText}>
                {Object.entries(healing)
                  .map(([name, level]) => `${level}${name}`)
                  .join(' ')}
              </div>
            )}
          </div>
          <button className={styles.editBtn} onClick={() => onEditAbilities(character)}>
            ✏️ 编辑技能
          </button>
        </div>
      </div>
    </div>
  );
}
