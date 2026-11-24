import { useSyncExternalStore } from 'react';

// The user's profile photo, stored in this browser only (as a small data URL).
// Every change fires an event so the top bar, dashboard and profile page stay in sync.
const PHOTO_KEY = 'userPhoto';
const CHANGE_EVENT = 'userPhotoChanged';

export const getUserPhoto = () => {
  try {
    return localStorage.getItem(PHOTO_KEY) || '';
  } catch {
    return '';
  }
};

// Throws if the browser refuses to store it (for example, storage is full).
export const setUserPhoto = (dataUrl) => {
  localStorage.setItem(PHOTO_KEY, dataUrl);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const clearUserPhoto = () => {
  try {
    localStorage.removeItem(PHOTO_KEY);
  } catch {
    // storage unavailable: nothing to remove
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (callback) => {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback); // changes from another tab
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

export const useUserPhoto = () => useSyncExternalStore(subscribe, getUserPhoto, () => '');
