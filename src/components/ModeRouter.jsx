import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, useLocation, useNavigate } from 'react-router-dom';
import { isMobileMode, isNativeApp, setMobileMode } from '../utils/appMode';
import { useMediaQuery } from '../utils/useMediaQuery';
import PhoneFrame from './PhoneFrame';

const embedded = typeof window !== 'undefined' && window.self !== window.top;

// Draws the routes and keeps you on the right set of screens.
// The phone version lives under /m (landing page at /m, the app at /m/dashboard). Once you are in it, links to
// '/' and '/dashboard/...' are shown as their /m twins. The routes are matched against the twin straight away (so nothing
// remounts or flashes) and the address bar is corrected right after.
const ModeRoutes = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search, hash } = location;
  const wideScreen = useMediaQuery('(min-width: 600px)');

  const inMobileArea = pathname === '/m' || pathname.startsWith('/m/');
  if (inMobileArea) setMobileMode(true);

  const inDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const redirect = (inDashboard || pathname === '/') && isMobileMode();
  const mobilePath = redirect ? (pathname === '/' ? '/m' : `/m${pathname}`) : null;

  useLayoutEffect(() => {
    if (mobilePath) navigate(`${mobilePath}${search}${hash}`, { replace: true });
  }, [mobilePath, search, hash, navigate]);

  // Inside the phone outline: tell the outer page where we are.
  useEffect(() => {
    if (embedded) window.parent.postMessage({ type: 'naari-path', path: `${pathname}${search}${hash}` }, window.location.origin);
  }, [pathname, search, hash]);

  // A computer screen showing /m: draw the phone outline and run the app inside it.
  if (inMobileArea && wideScreen && !embedded && !isNativeApp()) return <PhoneFrame />;

  const shown = redirect ? { ...location, pathname: mobilePath } : location;
  return <Routes location={shown}>{children}</Routes>;
};

export default ModeRoutes;
