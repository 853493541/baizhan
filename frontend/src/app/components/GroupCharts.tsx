'use client';

import styles from '../page.module.css';
import api from '../utils/api';
import { useCallback } from 'react';
import type { Character } from '../types';

interface Props {
  groups: Character[][];
  setGroups: (groups: Character[][]) => void;
  showNames: boolean;
}

const CORE_ABILITIES = ['钱', '斗', '天', '黑', '引'];

const simplifyAbilityName = (name: string): string => {
  if (name.startsWith('花') || name.startsWith('钱')) return '钱';
  if (name.startsWith('斗')) return '斗';
  if (name.startsWith('天')) return '天';
  if (name.startsWith('黑')) return '黑';
  if (name.startsWith('引')) return '引';
  return name[0];
};

const getContributors = (char: Character): string[] => {
  const coreEntries = Object.entries(char.abilities?.core || {}).filter(
    ([_, level]) => level >= 9
  );
  const healingEntries = Object.entries(char.abilities?.healing || {}).filter(
    ([_, level]) => level >= 9
  );

  const owned = [...coreEntries, ...healingEntries].map(([k]) =>
    simplifyAbilityName(k)
  );

  const ownedSet = new Set(owned);
  return CORE_ABILITIES.filter((ab) => !ownedSet.has(ab));
};

export default function GroupCharts({ groups, setGroups, showNames }: Props) {
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
      if (accountSet.has(char.account)) {
        warnings.push('⚠️ 同账号角色');
      } else {
        accountSet.add(char.account);
      }

      const core = char.abilities?.core ?? {};
      for (const [ability, level] of Object.entries(core)) {
        if (level >= 9) {
          abilityCounts[ability] = (abilityCounts[ability] || 0) + 1;
        }
      }

      if (char.role.toLowerCase() === 'healer') hasHealer = true;
    }

    for (const [ability, count] of Object.entries(abilityCounts)) {
      if (count > 2) {
        warnings.push(`⚠️ 冲突技能: ${simplifyAbilityName(ability)}`);
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
            {group.map((char) => {
              const text = showNames
                ? (char.comboBurst ? `@${char.name}` : char.name)
                : getContributors(char).join(' ') || '无';

              return (
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
                  title="右键取消"
                >
                  {text}
                </div>
              );
            })}

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
