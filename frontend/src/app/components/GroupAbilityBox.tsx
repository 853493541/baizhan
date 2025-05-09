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
        <div className={styles.bottomRow}>
          <div style={{ position: 'relative' }}>
            <button className={styles.suggestButton} onClick={onSuggestClick}>
              ＋
            </button>

            {suggestingIndex === index && (
              <div className={styles.suggestionPopup}>
                <div className={styles.suggestionList}>
                  {allCharacters.map((char) => (
                    <div
                      key={char._id}
                      className={styles.suggestionItem}
                      onClick={() => onSelectSuggestion(char)}
                    >
                      <CharacterPill
                        char={char}
                        showLevels={showLevels}
                        showContributors={showContributors}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Checkboxes group={group} />
        </div>
      )}
    </div>
  );
}
