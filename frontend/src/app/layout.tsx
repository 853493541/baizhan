// src/app/layout.tsx

import './globals.css'; // or remove if you don’t use this file

export const metadata = {
  title: '角色排表系统',
  description: '用于分配角色到小组的管理界面',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head />
      <body>{children}</body>
    </html>
  );
}
