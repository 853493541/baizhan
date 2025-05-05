'use client';

import styles from './Styles/page.module.css';
import api from './utils/api';
import { useCallback } from 'react';

type Character = {
  _id: string;
  name: string;
  account: string;
  role: string;
  class: string;
  abilities?: { [key: string]: number };
};

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
}

export default function GroupCharts({ groups, setGroups }: Props) {
  const autoSaveGroups = useCallback((updated: Character[][]) => {
    setGroups(updated);
    api.post('/groups', updated).catch((err) =>
      console.error('Auto-save failed:', err)
    );
  }, [setGroups]);

  const getColorClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'healer': return styles.pinkBox;
      case 'dps': return styles.greenBox;
      case 'tank': return styles.goldBox;
      default: return styles.defaultBox;
    }
  };

  const validateGroup = (group: Character[]): string[] => {
    const warnings: string[] = [];

    const accountSet = new Set<string>();
    const abilityCounts: { [key: string]: number } = {};
    let hasHealer = false;

    for (const char of group) {
      // Rule 1: Duplicate account
      if (accountSet.has(char.account)) {
        warnings.push('⚠️ 同账号角色');
      } else {
        accountSet.add(char.account);
      }

      // Rule 2: Count abilities
      if (char.abilities) {
        for (const ability of Object.keys(char.abilities)) {
          abilityCounts[ability] = (abilityCounts[ability] || 0) + 1;
        }
      }

      // Rule 3: Must have at least one healer
      if (char.role.toLowerCase() === 'healer') hasHealer = true;
    }

    for (const [ability, count] of Object.entries(abilityCounts)) {
      if (count > 2) {
        warnings.push(`⚠️ 冲突技能: ${ability}`);
      }
    }

    if (!hasHealer) warnings.push('⚠️ 缺少治疗');

    return warnings;
  };

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => {
        const warnings = validateGroup(group);

        return (
          <div
            key={index}
            className={styles.groupBox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const char = JSON.parse(e.dataTransfer.getData('text/plain'));

              const updated = groups.map((g) =>
                g.filter((c) => c._id !== char._id)
              );

              updated[index] = [...updated[index], char];

              autoSaveGroups(updated);
            }}
          >
            <h3>组 {index + 1}</h3>
            {group.map((char) => (
              <div
                key={char._id}
                className={`${styles.characterCard} ${getColorClass(char.role)}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(char));
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const updated = groups.map((g, gi) =>
                    gi === index ? g.filter((c) => c._id !== char._id) : g
                  );
                  autoSaveGroups(updated);
                }}
                title="Right click to remove"
              >
                {char.name}
              </div>
            ))}

            {warnings.length > 0 && (
              <div className={styles.warningBox}>
                {warnings.map((w, i) => (
                  <div key={i}>{w}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
