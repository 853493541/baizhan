'use client';

import { useState, useEffect } from 'react';
import styles from './Styles/EditCharacterInfo.module.css';

type LocalCharacter = {
  _id?: string;
  name: string;
  role: string;
  account: string;
  owner: string;
  class: string;
  comboBurst: boolean;
  abilities: {
    core: { [key: string]: number };
    healing: { [key: string]: number };
  };
};

type Props = {
  character: LocalCharacter;
  onSave: (updated: LocalCharacter) => void;
  onCancel: () => void;
};

const roles = ['DPS', 'Tank', 'Healer'];
const classes = ['七秀', '天策', '明教', '少林', '凌雪', '纯阳', '药宗', '五毒', '刀宗', '蓬莱'];

export default function EditCharacterInfo({ character, onSave, onCancel }: Props) {
  const [role, setRole] = useState(character.role);
  const [charClass, setCharClass] = useState(character.class);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const hasChanged = role !== character.role || charClass !== character.class;
    if (!hasChanged) return;

    const updated: LocalCharacter = {
      ...character,
      role,
      class: charClass,
    };

    onSave(updated);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1000);
    return () => clearTimeout(timer);
  }, [role, charClass]);

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
              <option key={r} value={r}>{r}</option>
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
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.buttonRow}>
        {saved && <span className={styles.savedNotice}>✅ 已自动保存</span>}
        <button className={styles.cancelButton} onClick={onCancel}>关闭</button>
      </div>
    </div>
  );
}
