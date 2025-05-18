// src/app/playground/SkillTogglePanel.tsx
'use client';

import React from 'react';
import styles from './Styles/page.module.css';
import { SkillToggle } from './usePlaygroundState';

interface Props {
  skillToggle: SkillToggle;
  setSkillToggle: (newToggle: SkillToggle) => void;
}

const SKILL_LABELS: Record<string, string> = {
  钱: '冯度 (钱)',
  斗: '冯度 (斗)',
  天: '鬼影',
  黑: '秦雷',
  引: '阿依努尔',
};

const CORE_SKILLS = ['钱', '斗', '天', '黑', '引'];

export default function SkillTogglePanel({ skillToggle, setSkillToggle }: Props) {
  const handleToggle = (skill: string) => {
    const updated = { ...skillToggle, [skill]: !skillToggle[skill] };
    setSkillToggle(updated);
  };

  return (
    <div className={styles.togglePanel}>
      <h3 style={{ marginBottom: '0.5rem' }}>🛠️ 自定义检查技能</h3>
      <div className={styles.toggleGrid}>
        {CORE_SKILLS.map((skill) => (
          <label key={skill} className={styles.skillToggle}>
            <input
              type="checkbox"
              checked={skillToggle[skill]}
              onChange={() => handleToggle(skill)}
            />
            {SKILL_LABELS[skill]}
          </label>
        ))}
      </div>
    </div>
  );
}
