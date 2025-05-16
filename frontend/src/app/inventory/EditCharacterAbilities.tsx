'use client';

import { useState } from 'react';
import styles from './Styles/EditCharacterAbilities.module.css';
import axios from 'axios';

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
  onCancel: () => void;
}

const api = process.env.NEXT_PUBLIC_API_BASE;

export default function EditCharacterAbilities({ character, onCancel }: Props) {
  const [editable, setEditable] = useState<Character>({ ...character });
  const [status, setStatus] = useState<string | null>(null);

  const showStatus = (skill: string, level: number) => {
    const message = `✅ ${editable.name} 的 “${skill}” 技能已更新为等级 ${level}`;
    setStatus(message);
    setTimeout(() => setStatus(null), 3000);
  };

  const saveToBackend = async (updated: Character, skill: string, level: number) => {
    if (!updated._id) return;
    try {
      await axios.put(`${api}/characters/${updated._id}`, updated);
      showStatus(skill, level);
    } catch (err) {
      console.error('❌ Failed to auto-save:', err);
    }
  };

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

    const updated = {
      ...editable,
      abilities: {
        ...editable.abilities,
        [target]: {
          ...editable.abilities[target],
          [name]: level,
        },
      },
    };

    setEditable(updated);
    saveToBackend(updated, name, level); // ✅ Auto-save with message
  };

  const increaseLevel = (name: string) => updateAbilityLevel(name, getLevel(name) + 1);
  const decreaseLevel = (name: string) => updateAbilityLevel(name, Math.max(0, getLevel(name) - 1));

  const deleteAbility = (name: string) => {
    const target = findTargetGroup(name);
    const copy = { ...editable.abilities[target] };
    delete copy[name];
    const updated = {
      ...editable,
      abilities: {
        ...editable.abilities,
        [target]: copy,
      },
    };
    setEditable(updated);
    saveToBackend(updated, name, 0); // ✅ Auto-save deletion
  };

  const toggleComboBurst = () => {
    const updated = {
      ...editable,
      comboBurst: !editable.comboBurst,
    };
    setEditable(updated);
    saveToBackend(updated, '真元', updated.comboBurst ? 1 : 0);
  };

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>编辑技能：{editable.name}</h2>

      {status && <div className={styles.statusBar}>{status}</div>}

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

      <div className={styles.buttonRow}>
        <button className={styles.cancelButton} onClick={onCancel}>取消</button>
      </div>
    </div>
  );
}
