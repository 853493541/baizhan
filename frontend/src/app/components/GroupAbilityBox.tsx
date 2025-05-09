'use client';

import React from 'react';
import styles from '../page.module.css';
import type { Character } from '../types';
import CharacterPill from './CharacterPill';
import Checkboxes from './Checkboxes';

interface Props {
  index: number;
  group: Character[];
  allCharacters: Character[];
  showLevels: boolean;
  showContributors: boolean;
  suggestingIndex: number | null;
  onSuggestClick: () => void;
  onSelectSuggestion: (char: Character) => void;
}

export default function GroupAbilityBox({
  index,
  group,
  allCharacters,
  showLevels,
  showContributors,
  suggestingIndex,
  onSuggestClick,
  onSelectSuggestion,
}: Props) {
  return (
    <div className={styles.groupBox}>
      <h3>组 {index + 1}</h3>

      {group.map((char) => (
        <CharacterPill
          key={char._id}
          char={char}
          showLevels={showLevels}
          showContributors={showContributors}
        />
      ))}

      {showContributors && (
        <>
         <div className={styles.bottomRow}>
  <button className={styles.suggestButton} onClick={onSuggestClick}>
    ＋
  </button>

  {showContributors && <Checkboxes group={group} />}
</div>
        </>
      )}

      {suggestingIndex === index && (
        <div className={styles.suggestionBox}>
          {allCharacters.map((char) => (
            <CharacterPill
              key={char._id}
              char={char}
              showLevels={showLevels}
              showContributors={showContributors}
              onClick={() => onSelectSuggestion(char)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
