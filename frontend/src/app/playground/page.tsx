// src/app/playground/PlaygroundPage.tsx
'use client';

import styles from './Styles/page.module.css';
import AvailableCharacters from './AvailableCharacters';
import GroupBoard from './GroupBoard';
import usePlaygroundState from './usePlaygroundState';

export default function PlaygroundPage() {
  const {
    allCharacters,
    groups,
    viewMode,
    showLevels,
    newGroupName,
    message,
    groupList,
    currentGroupId,
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
      </div>

      <div className={styles.resetRow}>
        <button className={styles.resetButton} onClick={handleSubmitCurrentSchedule}>
          ✅ 提交为当前排表
        </button>
      </div>

      <h2>可选角色</h2>
      <AvailableCharacters
        characters={allCharacters}
        onDragStart={handleDragStart}
        viewMode={viewMode}
        showLevels={showLevels}
      />

      <h2>小队</h2>
      <GroupBoard
        groups={groups}
        viewMode={viewMode}
        showLevels={showLevels}
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
        onRemove={handleRemoveCharacter}
        onDragStart={handleDragStart}
      />
    </div>
  );
}
