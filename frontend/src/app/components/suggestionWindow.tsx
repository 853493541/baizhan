'use client';

import React from 'react';
import styles from '../page.module.css';
import { Character } from '../types';

interface SuggestionWindowProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (char: Character) => void;
  candidates: Character[];
}

export default function SuggestionWindow({
  visible,
  onClose,
  onSelect,
  candidates,
}: SuggestionWindowProps) {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContentSmall}>
        <h3>推荐角色</h3>
        <div className={styles.list}>
          {candidates.map((char) => (
            <div
              key={char._id}
              className={styles.charCard}
              onClick={() => onSelect(char)}
            >
              <div>{char.name}</div>
              <div>{char.role} - {char.class}</div>
            </div>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}
