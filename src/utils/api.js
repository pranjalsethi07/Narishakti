const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const getConfiguredApiBase = () => {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }

  return '';
};

export const buildApiUrl = (path) => {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const base = getConfiguredApiBase();
  if (!base) return safePath;
  return `${base}${safePath}`;
};

export const apiFetch = (path, options) => fetch(buildApiUrl(path), options);
