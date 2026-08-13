import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const DashboardLayout = () => {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.mainWrapper}>
        <TopNav />
        <main style={styles.content}>
          <div style={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // prevent double scrollbar
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  }
};

export default DashboardLayout;
