import React, { useLayoutEffect } from 'react';
import { Routes, useLocation, useNavigate } from 'react-router-dom';
import { isMobileMode, setMobileMode } from '../utils/appMode';

// Draws the routes and keeps you on the right set of screens.
// Pages navigate to '/dashboard/...' everywhere; while in mobile mode those are shown as the same page under '/m'.
// The routes are matched against the '/m' address straight away (so the phone shell stays mounted and nothing
// flashes), and the address bar is corrected right after.
const ModeRoutes = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search, hash } = location;

  const inMobileArea = pathname === '/m' || pathname.startsWith('/m/');
  if (inMobileArea) setMobileMode(true);

  const inDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const redirect = inDashboard && isMobileMode();
  const mobilePath = redirect ? `/m${pathname.slice('/dashboard'.length)}` : null;

  useLayoutEffect(() => {
    if (mobilePath) navigate(`${mobilePath}${search}${hash}`, { replace: true });
  }, [mobilePath, search, hash, navigate]);

  const shown = redirect ? { ...location, pathname: mobilePath } : location;
  return <Routes location={shown}>{children}</Routes>;
};

export default ModeRoutes;
