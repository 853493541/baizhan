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
      <h1 className={styles.heading}>欢迎来到百战系统</h1>

      <div className={styles.buttonRow}>
        <button onClick={() => setShowModal(true)} className={styles.primaryBtn}>
          查看角色总览
        </button>
        <Link href="/inventory" className={styles.navBtn}>角色列表</Link>
        <Link href="/playground" className={styles.navBtn}>百战排组</Link>
      </div>

      {showModal && <CharacterSummaryModal onClose={() => setShowModal(false)} />}

      <h2 className={styles.subheading}>📋 本周排表</h2>
      <CurrentScheduleView />
    </div>
  );
}
