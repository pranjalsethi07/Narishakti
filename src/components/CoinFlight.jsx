import { useEffect } from 'react';
import { COIN_EARNED_EVENT, COIN_LANDED_EVENT } from '../lib/coinLedger';

// When coins are earned, a handful of gold coins fly from where they were earned (an element marked
// data-coin-source, else the middle of the screen) into the wallet in the header (data-coin-wallet),
// and the wallet gives a small bump when they land. It draws nothing itself.
// Without a visible wallet (small screens) or with reduced motion, it skips the flight and just
// tells the wallet to update.

const COIN_SIZE = 24;

const makeCoin = () => {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:fixed', 'left:0', 'top:0', `width:${COIN_SIZE}px`, `height:${COIN_SIZE}px`, 'border-radius:50%',
    'pointer-events:none', 'z-index:2000', 'will-change:transform,opacity', 'opacity:0',
    'background:radial-gradient(circle at 35% 30%, #fff3b0 0%, #f6c445 45%, #c98a12 100%)',
    'box-shadow:0 0 0 2px #b7791f inset, 0 2px 6px rgba(120,70,0,.35)',
  ].join(';');
  const inner = document.createElement('div');
  inner.style.cssText = 'position:absolute;inset:5px;border-radius:50%;border:2px solid rgba(183,121,31,.55)';
  el.appendChild(inner);
  return el;
};

const visibleRect = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? r : null;
};

const fly = (amount) => {
  const wallet = document.querySelector('[data-coin-wallet]');
  const target = visibleRect(wallet);
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const land = () => window.dispatchEvent(new Event(COIN_LANDED_EVENT));
  if (!target || calm || typeof document.body.animate !== 'function') {
    land();
    return;
  }

  // the screen has just re-rendered; find where the coins came from
  const sources = [...document.querySelectorAll('[data-coin-source]')];
  const from = sources.map(visibleRect).find(Boolean);
  const sx = from ? from.left + from.width / 2 : window.innerWidth / 2;
  const sy = from ? from.top + from.height / 2 : window.innerHeight / 2;
  const tx = target.left + target.width / 2;
  const ty = target.top + target.height / 2;

  const count = Math.min(12, Math.max(5, Math.round(amount / 5)));
  const nodes = [];
  const animations = [];

  for (let i = 0; i < count; i += 1) {
    const coin = makeCoin();
    document.body.appendChild(coin);
    nodes.push(coin);
    const startX = sx - COIN_SIZE / 2 + (Math.random() - 0.5) * 70;
    const startY = sy - COIN_SIZE / 2 + (Math.random() - 0.5) * 30;
    const endX = tx - COIN_SIZE / 2;
    const endY = ty - COIN_SIZE / 2;
    // a little arc: up and out first, then into the wallet
    const midX = startX + (endX - startX) * 0.35 + (Math.random() - 0.5) * 120;
    const midY = Math.min(startY, endY) - 40 - Math.random() * 60;
    animations.push(
      coin.animate(
        [
          { transform: `translate(${startX}px, ${startY}px) scale(0.4)`, opacity: 0 },
          { transform: `translate(${startX}px, ${startY - 20}px) scale(1)`, opacity: 1, offset: 0.15 },
          { transform: `translate(${midX}px, ${midY}px) scale(1.05) rotateY(180deg)`, opacity: 1, offset: 0.5 },
          { transform: `translate(${endX}px, ${endY}px) scale(0.45) rotateY(360deg)`, opacity: 0.9 },
        ],
        { duration: 850, delay: i * 70, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'forwards' },
      ),
    );
  }

  Promise.all(animations.map((a) => a.finished.catch(() => null))).then(() => {
    nodes.forEach((n) => n.remove());
    land();
    wallet.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }],
      { duration: 380, easing: 'ease-out' },
    );
  });
};

const CoinFlight = () => {
  useEffect(() => {
    let timer;
    const onEarned = (event) => {
      clearTimeout(timer);
      // wait a moment so the "+50 coins" element is on screen to fly from
      timer = setTimeout(() => fly(Number(event.detail?.amount) || 10), 350);
    };
    window.addEventListener(COIN_EARNED_EVENT, onEarned);
    return () => {
      window.removeEventListener(COIN_EARNED_EVENT, onEarned);
      clearTimeout(timer);
    };
  }, []);
  return null;
};

export default CoinFlight;
