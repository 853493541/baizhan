'use client';

import styles from './Styles/page.module.css';

import AvailableCharacters from './AvailableCharacters';
import GroupBoard from './GroupBoard';
import usePlaygroundState from './usePlaygroundState';
import SkillTogglePanel from './SkillTogglePanel';
import type { Character } from '../types';
import Link from 'next/link';
import { useState } from 'react';

export default function PlaygroundPage() {
  const {
    allCharacters,
    setAllCharacters,
    groups,
    setGroups,
    viewMode,
    showLevels,
    skillToggle,
    suggestGroupIndex,
    setSuggestGroupIndex,
    addCharacterToGroup,
    setSkillToggle,
    setViewMode,
    setShowLevels,
    handleSubmitCurrentSchedule,
    handleDragStart,
    handleDragOver,
    handleDropEvent,
    handleRemoveCharacter,
  } = usePlaygroundState();

  // Control center open state
  const [controlOpen, setControlOpen] = useState(true);

  const handleSmartSchedule = async () => {
    try {
      console.log('开始智能排表流程...');
      const all = [...allCharacters, ...groups.flat()];

      const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/characters/summary`);
      const summary = await summaryRes.json();
      const needsCount = summary.needsCount;

      const payload = { characters: all, skillToggle, needsCount };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SOLVER_API}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.groups) {
        const nameToCharacter = new Map(all.map((c) => [`${c.name}|${c.account}`, c]));

        const fullGroups = data.groups.map((group: string[]) =>
          group
            .map((name: string) => {
              const [charName, account] = name.split('|');
              return nameToCharacter.get(`${charName}|${account}`);
            })
            .filter(Boolean)
        );

        setGroups(fullGroups);

        const usedKeys = new Set(fullGroups.flat().map((c: Character) => `${c.name}|${c.account}`));
        const remaining = allCharacters.filter((c) => !usedKeys.has(`${c.name}|${c.account}`));
        setAllCharacters(remaining);

        const scheduleRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/active-scheduling`);
        const schedules = await scheduleRes.json();
        const first = schedules[0];
        if (first?._id) {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/active-scheduling/${first._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groups: fullGroups }),
          });
        }
      } else {
        console.error('❌ Python 响应中未包含 `groups` 字段');
      }
    } catch (err) {
      console.error('❌ 智能排表失败:', err);
    }
  };

  const handleResetGroups = async () => {
    const all = [...allCharacters, ...groups.flat()];
    const emptyGroups: Character[][] = Array(8).fill([]);

    setAllCharacters(all);
    setGroups(emptyGroups);
    console.log('🔁 所有小队已重置');

    try {
      const scheduleRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/active-scheduling`);
      const schedules = await scheduleRes.json();
      const first = schedules[0];
      if (first?._id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/active-scheduling/${first._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groups: emptyGroups }),
        });
        console.log('💾 重置小队保存到数据库');
      }
    } catch (err) {
      console.error('❌ 无法保存重置状态:', err);
    }
  };

  //UI
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          主页
        </Link>
        <span className={styles.breadcrumbDivider}>/</span>
        <span>排表工作台</span>
      </div>

      <SkillTogglePanel skillToggle={skillToggle} setSkillToggle={setSkillToggle} />

      <div className={styles.titleRow}>
        {/* 选择显示方式 */}
        <div className={styles.modeBlock}>
          <div className={styles.modeLabel}>显示模式</div>
          <div className={styles.modeOptions} data-mode={viewMode}>
            <div className={styles.slider}></div>
            <button
              className={`${styles.modeButton} ${viewMode === 'name' ? styles.active : ''}`}
              onClick={() => setViewMode('name')}
            >
              名字
            </button>
            <button
              className={`${styles.modeButton} ${viewMode === 'core' ? styles.active : ''}`}
              onClick={() => setViewMode('core')}
            >
              技能
            </button>
            <button
              className={`${styles.modeButton} ${viewMode === 'needs' ? styles.active : ''}`}
              onClick={() => setViewMode('needs')}
            >
              需求
            </button>
          </div>
          {viewMode === 'core' && (
            <label className={styles.levelToggle}>
              <input
                type="checkbox"
                checked={showLevels}
                onChange={() => setShowLevels(!showLevels)}
              />
              显示等级
            </label>
          )}
        </div>
        {/* end of 选择显示方式 */}
      </div>

      <AvailableCharacters
        characters={allCharacters}
        onDragStart={handleDragStart}
        viewMode={viewMode}
        showLevels={showLevels}
        skillToggle={skillToggle}
      />

      <GroupBoard
        groups={groups}
        viewMode={viewMode}
        showLevels={showLevels}
        skillToggle={skillToggle}
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
        onRemove={handleRemoveCharacter}
        onDragStart={handleDragStart}
        allCharacters={allCharacters}
        suggestGroupIndex={suggestGroupIndex}
        setSuggestGroupIndex={setSuggestGroupIndex}
        addCharacterToGroup={addCharacterToGroup}
      />

      {/* Control Center */}



      
<div className={`${styles.controlCenter} ${controlOpen ? '' : styles.closed}`}>
  <button
    className={styles.toggleControlBtn}
    onClick={() => setControlOpen(!controlOpen)}
    aria-label={controlOpen ? 'Close control center' : 'Open control center'}
  >
    {controlOpen ? '▶' : '◀'}
  </button>

  {controlOpen && (
    <div className={styles.scheduleButtons}>
      <button className={styles.saveButton} onClick={handleSubmitCurrentSchedule}>
        ✅ 提交
      </button>
      <button className={styles.smartButton} onClick={handleSmartSchedule}>
        🧠 一键
      </button>
      <button className={styles.resetButton} onClick={handleResetGroups}>
        🔁 清空
      </button>
    </div>
  )}
</div>








    </div>
  );
}
