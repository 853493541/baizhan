'use client';

import { useState } from 'react';
import CharacterSummaryModal from './CharacterSummaryModal';
import CurrentScheduleView from './components/CurrentSchedule/CurrentScheduleView';
import styles from './Styles/page.module.css';
import Link from 'next/link';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>百战排表工具</h1>

      <div className={styles.buttonRow}>
        <button onClick={() => setShowModal(true)} className={styles.primaryBtn}>
          全局分析
        </button>
        <Link href="/inventory" className={styles.navBtn}>角色仓库</Link>
        <Link href="/playground" className={styles.navBtn}>排表工作台</Link>
      </div>

      {showModal && <CharacterSummaryModal onClose={() => setShowModal(false)} />}

      <h2 className={styles.subheading}>📋 本周排表</h2>
      <CurrentScheduleView />
    </div>
  );
}
