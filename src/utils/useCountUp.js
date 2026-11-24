import { useEffect, useState } from 'react';

// Counts from 0 up to `target` when the number first appears.
// Shows the final number straight away for people who prefer reduced motion.
export const useCountUp = (target, duration = 900) => {
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduceMotion]);

  return reduceMotion ? target : value;
};
