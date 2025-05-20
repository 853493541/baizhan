// src/app/playground/GroupBoard.tsx
'use client';

import React from 'react';
import styles from './Styles/GroupBoard.module.css';
import { getCheckedNeeds, getGroupWarnings } from './ruleCheckers';
import { getFilteredNeeds, getEnabledCoreSkills, SkillToggle } from './filterSkills';
import SuggestionModal from './SuggestionModal';

interface Character {
  name: string;
  role: string;
  account: string;
  owner: string;
  comboBurst: boolean;
  core?: Record<string, number>;
  needs?: string[];
}

type ViewMode = 'name' | 'core' | 'needs';

interface Props {
  groups: Character[][];
  viewMode: ViewMode;
  showLevels: boolean;
  skillToggle: SkillToggle;

  allCharacters: Character[];
  suggestGroupIndex: number | null;
  setSuggestGroupIndex: (val: number | null) => void;
  addCharacterToGroup: (groupIndex: number, char: Character) => void;

  onDrop: (e: React.DragEvent, groupIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemove: (groupIndex: number, charIndex: number, char: Character) => void;
  onDragStart: (e: React.DragEvent, char: Character, originGroupIndex: number) => void;
}

export default function GroupBoard({
  groups,
  viewMode,
  showLevels,
  skillToggle,
  allCharacters,
  suggestGroupIndex,
  setSuggestGroupIndex,
  addCharacterToGroup,
  onDrop,
  onDragOver,
  onRemove,
  onDragStart,
}: Props) {
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'Tank':
        return styles.tank;
      case 'Healer':
        return styles.healer;
      case 'DPS':
        return styles.dps;
      default:
        return styles.defaultBox;
    }
  };

  const renderDisplay = (char: Character) => {
    if (viewMode === 'name') return `${char.comboBurst ? '@' : ''}${char.name}`;

    if (viewMode === 'core') {
      if (!char.core) return '(无技能)';
      const visibleCore = Object.entries(char.core).filter(([skill]) => skillToggle[skill]);
      return visibleCore.length > 0
        ? visibleCore.map(([k, v]) => (showLevels ? `${v}${k}` : k)).join('  ')
        : '(无技能)';
    }

    if (viewMode === 'needs') {
      const visibleNeeds = getFilteredNeeds(char.needs, skillToggle);
      return visibleNeeds.length > 0 ? visibleNeeds.join(' ') : '无需求';
    }

    return char.name;
  };

  return (
    <div className={styles.groupGrid}>
      {groups.map((group, groupIndex) => {
        const checked = getCheckedNeeds(group);
        const warnings = getGroupWarnings(group, skillToggle);
        const filteredSkills = getEnabledCoreSkills(skillToggle);

        return (
          <div
            key={groupIndex}
            className={styles.groupCard}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, groupIndex)}
          >
            <h3>组 {groupIndex + 1}</h3>

            {/* Characters */}
            {group.map((char, i) => (
              <div
                key={i}
                className={`${styles.charPill} ${getRoleClass(char.role)}`}
                draggable
                onDragStart={(e) => onDragStart(e, char, groupIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onRemove(groupIndex, i, char);
                }}
              >
                {renderDisplay(char)}
              </div>
            ))}

            {/* Suggestion Button */}
            <div className={styles.suggestRow}>
              <button
                className={styles.suggestButton}
                onClick={() => setSuggestGroupIndex(groupIndex)}
              >
                ＋
              </button>
            </div>

            {/* Core Skill Checkboxes */}
            <div className={styles.checkboxRow}>
              {filteredSkills.map((skill) => (
                <div
                  key={skill}
                  className={checked[skill] ? styles.checked : styles.unchecked}
                >
                  {skill}
                </div>
              ))}
            </div>

            {/* Warnings */}
            <div className={styles.warningBox}>
              {warnings.map((w, i) => (
                <div key={i} className={styles.warning}>{w}</div>
              ))}
            </div>
          </div>
        );
      })}

      {suggestGroupIndex !== null && (
        <SuggestionModal
          groupIndex={suggestGroupIndex}
          currentGroup={groups[suggestGroupIndex]}
          allCharacters={allCharacters}
          onSelect={addCharacterToGroup}
          onClose={() => setSuggestGroupIndex(null)}
          viewMode={viewMode}
          showLevels={showLevels}
          skillToggle={skillToggle}
        />
      )}
    </div>
  );
}
