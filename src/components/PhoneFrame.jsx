import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// On a computer screen, /m is shown inside a phone outline. The app runs in an iframe so it gets a real phone-sized
// screen (its own width, media queries, pop-ups and all). The iframe tells us which page it is on so the address bar follows.
const PhoneFrame = () => {
  const { pathname, search, hash } = useLocation();
  const [src] = useState(() => `${pathname}${search}${hash}`); // only the first address: later moves happen inside the iframe

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'naari-path' || typeof e.data.path !== 'string') return;
      if (e.data.path.startsWith('/')) window.history.replaceState(null, '', e.data.path);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div style={styles.stage}>
      <div style={styles.device}>
        <div style={styles.notch} aria-hidden="true" />
        <iframe
          title="narishakti phone view"
          src={src}
          style={styles.screen}
          allow="geolocation; microphone; camera; clipboard-write; clipboard-read"
        />
      </div>
    </div>
  );
};

const styles = {
  stage: { minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'radial-gradient(circle at 30% 20%, #3a2a55, #14101f 70%)' },
  device: {
    position: 'relative', width: 390 + 24, height: 'min(844px, calc(100dvh - 32px))', borderRadius: 52, border: '12px solid #0e0e12',
    boxShadow: '0 0 0 2px #4a4a55, 0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden', backgroundColor: '#0e0e12', display: 'flex', flexDirection: 'column',
  },
  notch: { flex: 'none', alignSelf: 'center', width: 96, height: 22, margin: '6px 0', borderRadius: 14, backgroundColor: '#000' },
  screen: { width: '100%', flex: 1, minHeight: 0, border: 0, display: 'block', backgroundColor: '#fff', borderRadius: '0 0 40px 40px' },
};

export default PhoneFrame;
