'use client';

import styles from './Styles/page.module.css';
import AvailableCharacters from './AvailableCharacters';
import GroupBoard from './GroupBoard';
import usePlaygroundState from './usePlaygroundState';
import SkillTogglePanel from './SkillTogglePanel';
import type { Character } from '../types';

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

  const handleSmartSchedule = async () => {
    try {
      console.log('🧠 开始智能排表流程...');
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

        // Save to DB
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

  return (
    <div className={styles.container}>
      <h1>分组总览</h1>

      <div className={styles.toggleButtons}>
        <button onClick={() => setViewMode('name')}>显示名字</button>
        <button onClick={() => setViewMode('core')}>显示技能</button>
        <button onClick={() => setViewMode('needs')}>显示需求</button>
        {viewMode === 'core' && (
          <label style={{ marginLeft: '1rem', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={showLevels}
              onChange={() => setShowLevels(!showLevels)}
              style={{ marginRight: '0.5rem' }}
            />
            显示等级
          </label>
        )}
        <button
          onClick={handleSmartSchedule}
          className={styles.smartButton}
          style={{ marginLeft: '2rem' }}
        >
          🧠 智能排表
        </button>
      </div>

      <div className={styles.resetRow}>
        <button className={styles.resetButton} onClick={handleSubmitCurrentSchedule}>
          ✅ 提交为当前排表
        </button>
        <button className={styles.resetButton} onClick={handleResetGroups}>
          🔁 重置小队
        </button>
      </div>

      <SkillTogglePanel skillToggle={skillToggle} setSkillToggle={setSkillToggle} />

      <h2>可选角色</h2>
      <AvailableCharacters
        characters={allCharacters}
        onDragStart={handleDragStart}
        viewMode={viewMode}
        showLevels={showLevels}
        skillToggle={skillToggle}
      />

      <h2>小队</h2>
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
    </div>
  );
}
