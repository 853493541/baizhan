'use client';

import { useEffect, useState } from 'react';
import styles from './Styles/CharacterSummaryModal.module.css';
import axios from 'axios';

interface CharacterEntry {
  name: string;
  role: 'DPS' | 'Healer' | 'Tank';
}

interface SummaryData {
  needsCount: Record<string, number>;
  needsDetail: Record<string, CharacterEntry[]>;
  level10: Record<string, CharacterEntry[]>;
}

interface Props {
  onClose: () => void;
}

const api = process.env.NEXT_PUBLIC_API_BASE;

export default function CharacterSummaryModal({ onClose }: Props) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [openNeeds, setOpenNeeds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    axios
      .get(`${api}/characters/summary`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('❌ Failed to fetch summary:', err));
  }, []);

  const toggleNeed = (skill: string) => {
    setOpenNeeds((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  const groupByRole = (entries: CharacterEntry[]) => {
    const groups: Record<'Tank' | 'Healer' | 'DPS', string[]> = {
      Tank: [],
      Healer: [],
      DPS: [],
    };
    for (const entry of entries) {
      if (groups[entry.role]) groups[entry.role].push(entry.name);
    }
    return groups;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Tank': return styles.tank;
      case 'Healer': return styles.healer;
      case 'DPS': return styles.dps;
      default: return '';
    }
  };

  if (!data) {
  return (
    <div className={styles.overlay}>
      <div className={styles.loadingBox}>
        加载信息中...
      </div>
    </div>
  );
}
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>全局技能分析</h2>

        

        <h3 className={styles.subheading}>缺失技能</h3>
        <div className={styles.table}>
          {Object.entries(data.needsCount).map(([skill, count]) => (
            <div key={skill} className={styles.row}>
              <div className={styles.skillRow}>
                <div className={styles.skillLabel}>{count} 个角色缺少 {skill}</div>
                <button onClick={() => toggleNeed(skill)} className={styles.toggleBtn}>
                  {openNeeds[skill] === false ? '显示' : '隐藏'}
                </button>
              </div>
              {(openNeeds[skill] !== false) && (
                <div className={styles.detailBlock}>
                  {(() => {
                    const grouped = groupByRole(data.needsDetail[skill] || []);
                    return (
                      <>
                        {grouped.Tank.length > 0 && (
                          <div className={styles.roleRow}>
                            <span className={styles.tank}>{grouped.Tank.join('，')}</span>
                          </div>
                        )}
                        {grouped.Healer.length > 0 && (
                          <div className={styles.roleRow}>
                            <span className={styles.healer}>{grouped.Healer.join('，')}</span>
                          </div>
                        )}
                        {grouped.DPS.length > 0 && (
                          <div className={styles.roleRow}>
                            <span className={styles.dps}>{grouped.DPS.join('，')}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 className={styles.subheading}>10级技能：</h3>
        <div className={styles.table}>
          {Object.entries(data.level10).map(([skill, entries]) => {
            const grouped = groupByRole(entries);
            return (
              <div key={skill} className={styles.row}>
                <div className={styles.skillLabel}>{skill}</div>
                <div className={styles.detailBlock}>
                  {grouped.Tank.length > 0 && (
                    <div className={styles.roleRow}>
                      <span className={styles.tank}>{grouped.Tank.join('，')}</span>
                    </div>
                  )}
                  {grouped.Healer.length > 0 && (
                    <div className={styles.roleRow}>
                      <span className={styles.healer}>{grouped.Healer.join('，')}</span>
                    </div>
                  )}
                  {grouped.DPS.length > 0 && (
                    <div className={styles.roleRow}>
                      <span className={styles.dps}>{grouped.DPS.join('，')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}
