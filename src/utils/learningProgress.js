const DEFAULT_PROGRESS = { health: [], finance: [] };

export const LEARNING_MODULE_SEQUENCE = {
  health: [
    { id: 1, title: 'Basic Female Anatomy', duration: '5 min' },
    { id: 2, title: 'Menstruation Basics', duration: '6 min' },
    { id: 3, title: 'Menstrual Hygiene', duration: '7 min' },
    { id: 4, title: 'Hormones & Mood', duration: '6 min' },
    { id: 5, title: 'Pregnancy Basics', duration: '8 min' },
    { id: 6, title: 'Health Myths', duration: '5 min' },
  ],
  finance: [
    { id: 1, title: 'Bank Account Basics', duration: '5 min' },
    { id: 2, title: 'UPI & Digital Payments', duration: '6 min' },
    { id: 3, title: 'Saving Money', duration: '7 min' },
    { id: 4, title: 'Fixed Deposit (FD)', duration: '5 min' },
    { id: 5, title: 'Fraud Awareness', duration: '6 min' },
  ],
};

export const getStoredLearnProgress = () => {
  const raw = localStorage.getItem('learnProgress');
  if (!raw) return DEFAULT_PROGRESS;

  try {
    const parsed = JSON.parse(raw);
    return {
      health: Array.isArray(parsed.health) ? parsed.health : [],
      finance: Array.isArray(parsed.finance) ? parsed.finance : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const getFirstIncompleteIndex = (category, progress) => {
  const modules = LEARNING_MODULE_SEQUENCE[category] || [];
  const completed = progress?.[category] || [];
  const idx = modules.findIndex((m) => !completed.includes(m.id));
  return idx === -1 ? modules.length - 1 : idx;
};

export const getRecommendedCategory = (progress) => {
  const healthIncomplete = getFirstIncompleteIndex('health', progress);
  const financeIncomplete = getFirstIncompleteIndex('finance', progress);

  const healthDone = (progress?.health || []).length;
  const financeDone = (progress?.finance || []).length;

  if (healthDone === LEARNING_MODULE_SEQUENCE.health.length && financeDone < LEARNING_MODULE_SEQUENCE.finance.length) {
    return 'finance';
  }
  if (financeDone === LEARNING_MODULE_SEQUENCE.finance.length && healthDone < LEARNING_MODULE_SEQUENCE.health.length) {
    return 'health';
  }

  return healthIncomplete <= financeIncomplete ? 'health' : 'finance';
};

export const getContinueLearningMeta = (progress) => {
  const category = getRecommendedCategory(progress);
  const modules = LEARNING_MODULE_SEQUENCE[category] || [];
  const idx = getFirstIncompleteIndex(category, progress);
  const safeIdx = idx < 0 ? 0 : idx;
  const module = modules[safeIdx] || modules[0];

  const completedCount = (progress?.[category] || []).length;
  const total = modules.length || 1;
  const completionPercent = Math.round((completedCount / total) * 100);

  return {
    category,
    module,
    moduleNumber: Math.min(safeIdx + 1, total),
    completionPercent,
  };
};
