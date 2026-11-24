import {
  LayoutDashboard, BookOpen, Sparkles, Lightbulb, ShieldCheck, Gamepad2, GraduationCap, HeartPulse,
  Stethoscope, Activity, FileText, Users, Briefcase, Landmark, User,
} from 'lucide-react';

// The dashboard menu: single links and groups (a group has a heading and sub-items).
// Used by the sidebar to draw the menu and by the header to draw the breadcrumb.
export const NAV = [
  { type: 'link', key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { type: 'link', key: 'askAI', path: '/dashboard/ask', icon: Sparkles },
  {
    type: 'group', id: 'learning', labelKey: 'groupLearning', icon: GraduationCap, color: '#805ad5',
    items: [
      { key: 'learn', path: '/dashboard/learn', icon: BookOpen },
      { key: 'aajKaSawaal', path: '/dashboard/daily-question', icon: Lightbulb },
      { key: 'testKnowledge', path: '/dashboard/test', icon: ShieldCheck },
      { key: 'games', path: '/dashboard/games', icon: Gamepad2 },
    ],
  },
  {
    type: 'group', id: 'health', labelKey: 'groupHealth', icon: HeartPulse, color: '#d53f8c',
    items: [
      { key: 'digitalDoctor', path: '/dashboard/digital-doctor', icon: Stethoscope },
      { key: 'tracker', path: '/dashboard/tracker', icon: Activity },
      { key: 'docScanner', path: '/dashboard/scanner', icon: FileText },
    ],
  },
  {
    type: 'group', id: 'community', labelKey: 'groupCommunity', icon: Users, color: '#3182ce',
    items: [
      { key: 'community', path: '/dashboard/community', icon: Users },
      { key: 'opportunitiesWomen', path: '/dashboard/opportunities-women', icon: Briefcase },
    ],
  },
  { type: 'link', key: 'schemes', path: '/dashboard/schemes', icon: Landmark },
  { type: 'link', key: 'profile', path: '/dashboard/profile', icon: User },
];

// Pages that are not in the menu but still need a title in the header.
const EXTRA_TITLES = {
  '/dashboard/progress': { en: 'Your Progress', hi: 'आपकी प्रगति' },
  '/dashboard/whatsapp': { en: 'WhatsApp', hi: 'व्हाट्सएप' },
};

// ['Learning', 'Play Games'] for a page inside a group, or just ['Govt Schemes'].
export const getCrumbs = (pathname, t, lang) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/dashboard') return [t('dashboard')];

  for (const node of NAV) {
    if (node.type === 'link' && node.path !== '/dashboard' && path.startsWith(node.path)) return [t(node.key)];
    if (node.type === 'group') {
      const item = node.items.find((i) => path.startsWith(i.path));
      if (item) return [t(node.labelKey), t(item.key)];
    }
  }
  const extra = EXTRA_TITLES[path];
  return [extra ? extra[lang] : t('dashboard')];
};
