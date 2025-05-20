'use client';

import React from 'react';
import styles from './Styles/SkillTogglePanel.module.css';
import { SkillToggle } from './usePlaygroundState';

interface Props {
  skillToggle: SkillToggle;
  setSkillToggle: (newToggle: SkillToggle) => void;
}

const SKILL_LABELS: Record<string, string> = {
  天: '鬼影',
  黑: '秦雷',
  引: '阿依努尔',
};

const BOSS_COLOR_CLASS: Record<string, string> = {
  冯度: styles.bossPurple,
  鬼影: styles.bossYellow,
  秦雷: styles.bossYellow,
  阿依努尔: styles.bossRed,
};

export default function SkillTogglePanel({ skillToggle, setSkillToggle }: Props) {
  const toggle冯度 = () => {
    const next = !skillToggle['钱'] || !skillToggle['斗'];
    setSkillToggle({
      ...skillToggle,
      钱: next,
      斗: next,
    });
  };

  const is冯度Checked = skillToggle['钱'] && skillToggle['斗'];

  const toggleSkill = (skill: string) => {
    setSkillToggle({ ...skillToggle, [skill]: !skillToggle[skill] });
  };

  return (
    <div className={styles.togglePanel}>
      <h3>
        技能开关
        <span className={styles.subtitle}>取消勾选将不再考虑该技能</span>
      </h3>
      <div className={styles.toggleGrid}>
        {/* 冯度 */}
        <button
          type="button"
          className={`${styles.skillButton} ${BOSS_COLOR_CLASS['冯度']} ${
            is冯度Checked ? styles.active : styles.inactive
          }`}
          onClick={toggle冯度}
        >
          冯度
        </button>

        {/* Other skill buttons */}
        {['天', '黑', '引'].map((skill) => {
          const bossName = SKILL_LABELS[skill];
          const isChecked = skillToggle[skill];
          return (
            <button
              key={skill}
              type="button"
              className={`${styles.skillButton} ${BOSS_COLOR_CLASS[bossName]} ${
                isChecked ? styles.active : styles.inactive
              }`}
              onClick={() => toggleSkill(skill)}
            >
              {bossName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
