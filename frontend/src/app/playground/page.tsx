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
    newGroupName,
    message,
    groupList,
    currentGroupId,
    skillToggle,
    suggestGroupIndex,
    setSuggestGroupIndex,
    addCharacterToGroup,
    setSkillToggle,
    setNewGroupName,
    setViewMode,
    setShowLevels,
    setCurrentGroupId,
    handleCreateNewGroup,
    handleSubmitCurrentSchedule,
    handleDragStart,
    handleDragOver,
    handleDropEvent,
    handleRemoveCharacter,
  } = usePlaygroundState();

  const handleSmartSchedule = async () => {
    try {
      const payload = {
        characters: [...allCharacters, ...groups.flat()],
        skillToggle,
      };

      console.log('📤 Sending to Python:', payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SOLVER_API}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('📥 Response from Python:', data);

      if (data.groups) {
        const all = [...allCharacters, ...groups.flat()];
        const nameToCharacter = new Map(
          all.map((c) => [`${c.name}|${c.account}`, c])
        );

        const fullGroups = data.groups.map((group: string[]) =>
          group
            .map((name: string) => {
              const [charName, account] = name.split('|');
              const char = nameToCharacter.get(`${charName}|${account}`);
              if (!char) {
                console.warn(`⚠️ Character not found for: ${name}`);
              }
              return char;
            })
            .filter(Boolean)
        );

        console.log('✅ Mapped fullGroups to Character[][]:', fullGroups);
        setGroups(fullGroups);

        const usedKeys = new Set(fullGroups.flat().map((c: Character) => `${c.name}|${c.account}`));
        const remaining = allCharacters.filter((c) => !usedKeys.has(`${c.name}|${c.account}`));
        setAllCharacters(remaining);

        if (currentGroupId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/active-scheduling/${currentGroupId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groups: fullGroups }),
          });
          console.log('💾 Groups saved to DB');
        }
      } else {
        console.error('❌ Python response did not contain `groups`');
      }
    } catch (err) {
      console.error('❌ 智能排表失败:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>分组总览</h1>

      <div className={styles.createGroupRow}>
        <input
          className={styles.groupInput}
          type="text"
          placeholder="新分组名称"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={handleCreateNewGroup}>创建新分组</button>
        {message && <span className={styles.message}>{message}</span>}
      </div>

      <div className={styles.groupSelectorRow}>
        <label htmlFor="groupSelect">切换分组:</label>
        <select
          id="groupSelect"
          value={currentGroupId || ''}
          onChange={(e) => setCurrentGroupId(e.target.value)}
        >
          {groupList.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

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
