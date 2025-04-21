'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterInfo.module.css';

type Character = {
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: { [key: string]: number };
};

type Props = {
  character: Character;
  onSave: (updated: Character) => void;
  onCancel: () => void;
};

const roles = ['DPS', 'Tank', 'Healer'];
const classes = ['七秀', '天策', '明教', '少林', '凌雪', '纯阳', '药宗', '五毒', '刀宗', '蓬莱'];

export default function EditCharacterInfo({ character, onSave, onCancel }: Props) {
  const [editable, setEditable] = useState<Character>({ ...character });

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>编辑角色信息：{editable.name}</h2>

      <div className={styles.formRow}>
        <div>
          <label className={styles.label}>定位 (role)</label>
          <select
            className={styles.select}
            value={editable.role}
            onChange={(e) => setEditable({ ...editable, role: e.target.value })}
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
            value={editable.class}
            onChange={(e) => setEditable({ ...editable, class: e.target.value })}
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
        <button className={styles.saveButton} onClick={() => onSave(editable)}>
          💾 保存
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}
