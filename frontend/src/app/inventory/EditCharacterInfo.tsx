'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterInfo.module.css';
import type { Character } from '../types';

type Props = {
  character: Character;
  onSave: (updated: Character) => void;
  onCancel: () => void;
};

const roles = ['DPS', 'Tank', 'Healer'];
const classes = ['七秀', '天策', '明教', '少林', '凌雪', '纯阳', '药宗', '五毒', '刀宗', '蓬莱'];

export default function EditCharacterInfo({ character, onSave, onCancel }: Props) {
  // Only edit role and class; retain everything else when saving
  const [role, setRole] = useState(character.role);
  const [charClass, setCharClass] = useState(character.class);

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>编辑角色信息：{character.name}</h2>

      <div className={styles.formRow}>
        <div>
          <label className={styles.label}>定位 (role)</label>
          <select
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>职业 (class)</label>
          <select
            className={styles.select}
            value={charClass}
            onChange={(e) => setCharClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button
          className={styles.saveButton}
          onClick={() =>
            onSave({ ...character, role, class: charClass })
          }
        >
          💾 保存
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}
