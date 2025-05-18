'use client';

import React from 'react';
import styles from './Styles/page.module.css';
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

  return (
    <div className={styles.togglePanel}>
      <h3 style={{ marginBottom: '0.5rem' }}>🛠️ 自定义检查技能</h3>
      <div className={styles.toggleGrid}>
        {/* 冯度 (钱 + 斗) */}
        <label className={styles.skillToggle}>
          <input
            type="checkbox"
            checked={is冯度Checked}
            onChange={toggle冯度}
          />
          冯度
        </label>

        {/* Other individual toggles */}
        {['天', '黑', '引'].map((skill) => (
          <label key={skill} className={styles.skillToggle}>
            <input
              type="checkbox"
              checked={skillToggle[skill]}
              onChange={() =>
                setSkillToggle({ ...skillToggle, [skill]: !skillToggle[skill] })
              }
            />
            {SKILL_LABELS[skill]}
          </label>
        ))}
      </div>
    </div>
  );
}
