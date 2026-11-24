import { Award, Lock } from 'lucide-react';
import { BADGES } from '../../../data/gamesData';

// A round medal for a level. `locked` shows a grey placeholder.
const Badge = ({ level, size = 64, locked = false, earned = true }) => {
  const badge = BADGES[level - 1];
  const dim = locked || !earned;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: dim ? '#e2e8f0' : `radial-gradient(circle at 30% 25%, #ffffff55, ${badge.tier} 60%)`,
        border: `3px solid ${dim ? '#cbd5e0' : badge.tier}`,
        boxShadow: dim ? 'none' : `0 4px 10px ${badge.tier}55`,
      }}
      aria-hidden="true"
    >
      {locked ? <Lock size={size * 0.38} color="#94a3b8" /> : <Award size={size * 0.5} color={dim ? '#94a3b8' : '#fff'} />}
      {!locked && (
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            minWidth: size * 0.34,
            height: size * 0.34,
            borderRadius: '999px',
            backgroundColor: dim ? '#94a3b8' : '#2d3748',
            color: '#fff',
            fontSize: size * 0.2,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
};

export default Badge;
