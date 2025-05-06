'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterAbilities.module.css';

export type Character = {
  _id?: string; // ✅ made optional here
  name: string;
  account: string;
  role: string;
  class: string;
  abilities: { [key: string]: number };
};

interface Props {
  character: Character;
  onSave: (updated: Character) => void;
  onCancel: () => void;
}

export default function EditCharacterAbilities({
  character,
  onSave,
  onCancel,
}: Props) {
  const [editable, setEditable] = useState<Character>({ ...character });
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityLevel, setNewAbilityLevel] = useState(0);

  const updateAbilityLevel = (name: string, level: number) => {
    if (level < 0) return;
    setEditable((prev) => ({
      ...prev,
      abilities: { ...prev.abilities, [name]: level },
    }));
  };

  const increaseLevel = (name: string) =>
    updateAbilityLevel(name, editable.abilities[name] + 1);

  const decreaseLevel = (name: string) =>
    updateAbilityLevel(name, Math.max(0, editable.abilities[name] - 1));

  const deleteAbility = (name: string) => {
    const copy = { ...editable.abilities };
    delete copy[name];
    setEditable({ ...editable, abilities: copy });
  };

  const addAbility = () => {
    if (!newAbilityName || newAbilityLevel <= 0) return;
    setEditable((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [newAbilityName]: newAbilityLevel,
      },
    }));
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
            <button
              className={styles.adjustBtn}
              onClick={() => decreaseLevel(name)}
            >
              –
            </button>
            <span className={styles.levelDisplay}>{level}</span>
            <button
              className={styles.adjustBtn}
              onClick={() => increaseLevel(name)}
            >
              +
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => deleteAbility(name)}
            >
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
        <button
          className={styles.saveButton}
          onClick={() => onSave(editable)}
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
