'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterAbilities.module.css';

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

export default function EditCharacterAbilities({ character, onSave, onCancel }: Props) {
  const [editable, setEditable] = useState<Character>({ ...character });
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityLevel, setNewAbilityLevel] = useState<number>(0);

  const updateAbilityLevel = (name: string, level: number) => {
    setEditable({
      ...editable,
      abilities: {
        ...editable.abilities,
        [name]: level,
      },
    });
  };

  const deleteAbility = (name: string) => {
    const updated = { ...editable.abilities };
    delete updated[name];
    setEditable({ ...editable, abilities: updated });
  };

  const addAbility = () => {
    if (!newAbilityName || newAbilityLevel <= 0) return;
    setEditable({
      ...editable,
      abilities: {
        ...editable.abilities,
        [newAbilityName]: newAbilityLevel,
      },
    });
    setNewAbilityName('');
    setNewAbilityLevel(0);
  };

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>编辑技能：{editable.name}</h2>

      <ul className={styles.abilityList}>
        {Object.entries(editable.abilities).map(([name, level]) => (
          <li key={name} className={styles.abilityItem}>
            <span className={styles.abilityLabel}>{name}</span>
            <input
              type="number"
              className={styles.abilityInput}
              value={level}
              onChange={(e) => updateAbilityLevel(name, Number(e.target.value))}
            />
            <button className={styles.deleteBtn} onClick={() => deleteAbility(name)}>
              删除
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.addRow}>
        <input
          type="text"
          placeholder="技能名"
          className={styles.addInput}
          value={newAbilityName}
          onChange={(e) => setNewAbilityName(e.target.value)}
        />
        <input
          type="number"
          placeholder="等级"
          className={styles.addInput}
          value={newAbilityLevel}
          onChange={(e) => setNewAbilityLevel(Number(e.target.value))}
        />
        <button className={styles.addButton} onClick={addAbility}>
          ➕ 添加技能
        </button>
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
