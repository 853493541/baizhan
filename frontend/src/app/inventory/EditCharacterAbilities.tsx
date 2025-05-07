'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterAbilities.module.css';

export type Character = {
  _id?: string;
  name: string;
  account: string;
  role: string;
  class: string;
  comboBurst?: boolean;
  abilities: {
    core: { [key: string]: number };
    healing: { [key: string]: number };
  };
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
  //const [newAbilityName, setNewAbilityName] = useState('');
  //const [newAbilityLevel, setNewAbilityLevel] = useState(0);

  const getLevel = (name: string): number =>
    editable.abilities.core[name] ?? editable.abilities.healing[name] ?? 0;

  const findTargetGroup = (name: string): 'core' | 'healing' => {
    if (name in editable.abilities.core) return 'core';
    if (name in editable.abilities.healing) return 'healing';
    return 'core';
  };

  const updateAbilityLevel = (name: string, level: number) => {
    if (level < 0) return;
    const target = findTargetGroup(name);
    setEditable((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [target]: {
          ...prev.abilities[target],
          [name]: level,
        },
      },
    }));
  };

  const increaseLevel = (name: string) =>
    updateAbilityLevel(name, getLevel(name) + 1);

  const decreaseLevel = (name: string) =>
    updateAbilityLevel(name, Math.max(0, getLevel(name) - 1));

  const deleteAbility = (name: string) => {
    const target = findTargetGroup(name);
    const copy = { ...editable.abilities[target] };
    delete copy[name];
    setEditable((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [target]: copy,
      },
    }));
  };

  const toggleComboBurst = () => {
    setEditable((prev) => ({
      ...prev,
      comboBurst: !prev.comboBurst,
    }));
  };

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>编辑技能：{editable.name}</h2>

      <div className={styles.comboBurstRow}>
        <span>真元：</span>
        <button
          onClick={toggleComboBurst}
          className={editable.comboBurst ? styles.toggleOn : styles.toggleOff}
        >
          {editable.comboBurst ? '  ✅  ' : '  ❌  '}
        </button>
      </div>

      <h3 className={styles.subtitle}>核心技能</h3>
      <ul className={styles.abilityList}>
        {Object.entries(editable.abilities.core).map(([name, level]) => (
          <li key={name} className={styles.abilityItem}>
            <span className={styles.abilityLabel}>{name}</span>
            <button className={styles.adjustBtn} onClick={() => decreaseLevel(name)}>–</button>
            <span className={styles.levelDisplay}>{level}</span>
            <button className={styles.adjustBtn} onClick={() => increaseLevel(name)}>+</button>
            <button className={styles.deleteBtn} onClick={() => deleteAbility(name)}>删除</button>
          </li>
        ))}
      </ul>

      <h3 className={styles.subtitle}>治疗技能</h3>
      <ul className={styles.abilityList}>
        {Object.entries(editable.abilities.healing).map(([name, level]) => (
          <li key={name} className={styles.abilityItem}>
            <span className={styles.abilityLabel}>{name}</span>
            <button className={styles.adjustBtn} onClick={() => decreaseLevel(name)}>–</button>
            <span className={styles.levelDisplay}>{level}</span>
            <button className={styles.adjustBtn} onClick={() => increaseLevel(name)}>+</button>
            <button className={styles.deleteBtn} onClick={() => deleteAbility(name)}>删除</button>
          </li>
        ))}
      </ul>

      {/*
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
          ➕ 添加技能（默认加在核心技能）
        </button>
      </div>
      */}

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
