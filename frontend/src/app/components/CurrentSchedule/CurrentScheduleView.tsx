// components/CurrentSchedule/CurrentScheduleView.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './CurrentSchedule.module.css';
import axios from 'axios';

interface Character {
  _id: string;
  name: string;
  account: string;
  owner: string;
  role: 'DPS' | 'Healer' | 'Tank';
  comboBurst: boolean;
  core: Record<string, number>;
  needs: string[];
}

interface Group {
  groupIndex: number;
  completed: boolean;
  note?: string;
  characters: Character[];
}

interface Schedule {
  weekTag: string;
  createdAt: string;
  groups: Group[];
  _id?: string;
}

type ViewMode = 'name' | 'core' | 'needs';
type StatusFilter = 'all' | 'done' | 'notDone';

export default function CurrentScheduleView() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('name');
  const [showLevels, setShowLevels] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('notDone');
  const api = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const url = `${api}/current-schedule`;
    console.log('📡 Trying to fetch:', url);

    axios
      .get(url)
      .then((res) => {
        console.log('✅ Schedule received:', res.data);
        setSchedule(res.data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch current schedule:', err);
      });
  }, []);

  const copyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    alert(`账号 ${account} 已复制`);
  };

  const saveChanges = (updatedGroups: Group[]) => {
    const updatedSchedule: Schedule = {
      ...schedule!,
      groups: updatedGroups
    };
    setSchedule(updatedSchedule);

    axios.post(`${api}/current-schedule/update`, updatedSchedule)
      .then(() => console.log('✅ Schedule changes saved'))
      .catch((err) => console.error('❌ Failed to save changes:', err));
  };

  if (!schedule) return <div className={styles.loading}>加载中，请稍候...</div>;

  const filteredGroups = schedule.groups.filter(group => {
    if (statusFilter === 'done') return group.completed;
    if (statusFilter === 'notDone') return !group.completed;
    return true;
  });

  return (
  <div className={styles.container}>
    <div className={styles.toggleRow}>
<div className={styles.toggleButtons}>
    <label>查看方式：</label>
  <button onClick={() => setViewMode('name')} className={viewMode === 'name' ? styles.activeBlue : ''}>名称</button>
  <button onClick={() => setViewMode('core')} className={viewMode === 'core' ? styles.activeBlue : ''}>技能</button>
  <button onClick={() => setViewMode('needs')} className={viewMode === 'needs' ? styles.activeBlue : ''}>缺失</button>
</div>

<div className={styles.toggleButtons}>
    <label>完成状态：</label>
      <button onClick={() => setStatusFilter('done')} className={statusFilter === 'done' ? styles.activeGreen : ''}>已完成</button>
  <button onClick={() => setStatusFilter('notDone')} className={statusFilter === 'notDone' ? styles.activeGreen : ''}>未完成</button>

  <button onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? styles.activeGreen : ''}>全部</button>
</div>
    </div>



      <div className={styles.groupGrid}>
        {filteredGroups.map((group) => (
          <div key={group.groupIndex} className={`${styles.groupBox} ${group.completed ? styles.completed : ''}`}>
            <div className={styles.groupHeader}>
              <span>第 {group.groupIndex + 1} 组</span>
              <label>

<input
  type="checkbox"
  checked={group.completed}
  onChange={() => {
    const confirmMessage = group.completed
      ? '确定要将此小组标记为“未完成”吗？'
      : '确定要将此小组标记为“已完成”？';
    if (!window.confirm(confirmMessage)) return;

    const updated = schedule.groups.map((g) =>
      g.groupIndex === group.groupIndex
        ? { ...g, completed: !g.completed }
        : g
    );
    saveChanges(updated);
  }}
/>
                已完成
              </label>
            </div>

            <div className={styles.charList}>
              {group.characters.map((char, i) => (
                <div
                  key={char._id ?? `${char.name}-${char.account}-${i}`}
                  className={
                    styles.charBox + ' ' +
                    (styles[char.role.toLowerCase()] || styles.defaultBox)
                  }
                  onClick={() => copyAccount(char.account)}
                >
                  {viewMode === 'name' && (
                    <span>{char.comboBurst ? `@${char.name}` : char.name}</span>
                  )}
                  {viewMode === 'core' && (
                    <span>
                      {Object.entries(char.core)
                        .map(([k, v]) => (showLevels ? `${v}${k}` : k))
                        .join('  ')}
                    </span>
                  )}
                  {viewMode === 'needs' && (
                    <span>{char.needs.join(' ')}</span>
                  )}
                </div>
              ))}
            </div>

            <textarea
              placeholder="记录掉落、备注等..."
              value={group.note || ''}
              onChange={(e) => {
                const updated = schedule.groups.map((g) =>
                  g.groupIndex === group.groupIndex ? { ...g, note: e.target.value } : g
                );
                saveChanges(updated);
              }}
              className={styles.noteBox}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
