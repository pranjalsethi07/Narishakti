import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle, BellRing, Copy, Hospital, Loader2, MapPin, MessageCircle, MessageSquare, Navigation, Phone,
  Plus, Share2, ShieldAlert, Siren, Trash2, X,
} from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import './sos.css';

// SOS: a red button that opens the emergency panel at once. The panel finds where she is (GPS),
// and in one tap calls 112 or a helpline, sends her location to her trusted contacts by SMS or
// WhatsApp, shows police stations and hospitals near her, or sounds a loud alarm.
// A web page cannot send an SMS or place a call by itself: each action opens the phone's own
// dialer, SMS or WhatsApp with everything filled in, ready to send.

const CONTACTS_KEY = 'sosContacts';
const MAX_CONTACTS = 5;
const HELPLINES = [
  { no: '112', en: 'Emergency', hi: 'आपातकाल' },
  { no: '181', en: 'Women helpline', hi: 'महिला हेल्पलाइन' },
  { no: '1091', en: 'Women in distress', hi: 'संकट में महिला' },
  { no: '100', en: 'Police', hi: 'पुलिस' },
  { no: '108', en: 'Ambulance', hi: 'एम्बुलेंस' },
  { no: '1930', en: 'Cyber fraud', hi: 'साइबर धोखाधड़ी' },
];

const loadContacts = () => {
  try {
    const list = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
    return Array.isArray(list) ? list.filter((c) => c && c.phone) : [];
  } catch {
    return [];
  }
};
const saveContacts = (list) => {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(list));
  } catch {
    // storage blocked: contacts last for this visit only
  }
};
const digits = (phone) => String(phone).replace(/[^\d+]/g, '');
// WhatsApp wants the number with its country code and no "+": a 10-digit Indian number gets 91
const waNumber = (phone) => {
  let d = String(phone).replace(/\D/g, '').replace(/^0+/, '');
  if (d.length === 10) d = `91${d}`;
  return d;
};
const mapsLink = (p) => `https://maps.google.com/?q=${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;

// A loud two-tone siren, made in the browser (no sound file needed).
const startSiren = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  const volume = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 960;
  lfo.type = 'triangle';
  lfo.frequency.value = 1.6; // sweeps up and down 1.6 times a second
  depth.gain.value = 380;
  volume.gain.value = 0.6;
  lfo.connect(depth).connect(osc.frequency);
  osc.connect(volume).connect(ctx.destination);
  osc.start();
  lfo.start();
  return () => {
    try {
      osc.stop();
      lfo.stop();
      ctx.close();
    } catch {
      // already stopped
    }
  };
};

export const SosButton = ({ variant = 'full', onOpen }) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const label = lang === 'hi' ? 'SOS — आपातकालीन मदद' : 'SOS — Emergency help';
  const openPanel = () => {
    onOpen?.();
    setOpen(true);
  };
  return (
    <>
      <button type="button" className={`sos-btn ${variant}`} onClick={openPanel} aria-label={label} title={label} aria-haspopup="dialog">
        {variant === 'full' ? (
          <>
            <span className="sos-badge">SOS</span>
            <span style={{ flex: 1 }}>
              {lang === 'hi' ? 'आपातकालीन मदद' : 'Emergency help'}
              <small>{lang === 'hi' ? 'लोकेशन भेजें · 112 पर कॉल' : 'Share location · Call 112'}</small>
            </span>
          </>
        ) : (
          'SOS'
        )}
      </button>
      {open && createPortal(<SosPanel onClose={() => setOpen(false)} />, document.body)}
    </>
  );
};

const SosPanel = ({ onClose }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const [pos, setPos] = useState(null); // { lat, lng, acc, at }
  const [locError, setLocError] = useState(() => ('geolocation' in navigator ? '' : 'unsupported'));
  const [contacts, setContacts] = useState(loadContacts);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [alarm, setAlarm] = useState(false);
  const [copied, setCopied] = useState(false);
  const stopSiren = useRef(null);
  const closeRef = useRef(null);

  // Find her as soon as the panel opens, and keep the position fresh while it stays open.
  useEffect(() => {
    if (!('geolocation' in navigator)) return undefined;
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy), at: new Date() });
        setLocError('');
      },
      (err) => setLocError(err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // the alarm stops when the panel closes
  useEffect(() => () => stopSiren.current?.(), []);
  const toggleAlarm = () => {
    if (alarm) {
      stopSiren.current?.();
      stopSiren.current = null;
      setAlarm(false);
    } else {
      stopSiren.current = startSiren();
      setAlarm(!!stopSiren.current);
    }
  };

  const message = useCallback(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const where = pos ? `My location: ${mapsLink(pos)} (accurate to ~${pos.acc} m)` : 'My location could not be found. Please call me.';
    return `🆘 SOS! I need help. / मुझे मदद चाहिए।\n${where}\nTime: ${time}\n— sent from NariShakti`;
  }, [pos]);

  const share = async () => {
    const text = message();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SOS', text });
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  const addContact = (e) => {
    e.preventDefault();
    if (digits(phone).replace('+', '').length < 8 || contacts.length >= MAX_CONTACTS) return;
    const next = [...contacts, { name: name.trim() || phone.trim(), phone: phone.trim() }];
    setContacts(next);
    saveContacts(next);
    setName('');
    setPhone('');
  };
  const removeContact = (i) => {
    const next = contacts.filter((_, k) => k !== i);
    setContacts(next);
    saveContacts(next);
  };
  // one SMS to everyone: numbers separated by commas; "?&body=" works on both Android and iPhone
  const smsAll = `sms:${contacts.map((c) => digits(c.phone)).join(',')}?&body=${encodeURIComponent(message())}`;

  const nearby = (what) =>
    pos ? `https://www.google.com/maps/search/${encodeURIComponent(what)}/@${pos.lat},${pos.lng},15z` : `https://www.google.com/maps/search/${encodeURIComponent(`${what} near me`)}`;

  const status = pos ? (
    <>
      <MapPin size={16} color="#c53030" />
      <span>
        <b>{pos.lat.toFixed(5)}, {pos.lng.toFixed(5)}</b>{' '}
        <span style={{ color: 'var(--text-muted)' }}>· {tr(`accurate to ~${pos.acc} m`, `~${pos.acc} मी. तक सटीक`)} · {pos.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </span>
    </>
  ) : locError ? (
    <>
      <AlertTriangle size={16} color="#c05621" />
      <span>
        {locError === 'denied'
          ? tr('Location permission is off. Allow location for this site in your browser settings, then reopen SOS. You can still call 112 below.', 'लोकेशन की अनुमति बंद है। ब्राउज़र सेटिंग में इस साइट के लिए लोकेशन चालू करें और SOS फिर खोलें। आप नीचे 112 पर कॉल कर सकती हैं।')
          : locError === 'unsupported'
            ? tr('This browser cannot find your location. You can still call for help below.', 'यह ब्राउज़र लोकेशन नहीं ढूँढ सकता। आप नीचे मदद के लिए कॉल कर सकती हैं।')
            : tr('Could not find your location yet. Move near a window or turn on GPS; still trying…', 'अभी लोकेशन नहीं मिली। खिड़की के पास जाएँ या GPS चालू करें; कोशिश जारी है…')}
      </span>
    </>
  ) : (
    <>
      <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <span>{tr('Finding your location…', 'आपकी लोकेशन ढूँढी जा रही है…')}</span>
    </>
  );

  const d = 0.006; // map window around her, ~1 km
  return (
    <div className="sos-backdrop" onClick={onClose}>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      <div className="sos-panel" role="dialog" aria-modal="true" aria-labelledby="sos-title" onClick={(e) => e.stopPropagation()}>
        <div className="sos-head">
          <ShieldAlert size={28} />
          <div>
            <h2 id="sos-title">{tr('SOS — Emergency help', 'SOS — आपातकालीन मदद')}</h2>
            <p>{tr('You are not alone. Help is one tap away.', 'आप अकेली नहीं हैं। मदद बस एक टैप दूर है।')}</p>
          </div>
          <button type="button" ref={closeRef} className="sos-close" onClick={onClose} aria-label={tr('Close', 'बंद करें')}><X size={20} /></button>
        </div>

        <div className="sos-body">
          <a className="sos-call112" href="tel:112"><Phone size={22} /> {tr('Call 112 now', 'अभी 112 पर कॉल करें')}</a>

          <div className="sos-row">
            <button type="button" className={`sos-act${alarm ? ' on' : ''}`} onClick={toggleAlarm} aria-pressed={alarm}>
              <Siren size={18} /> {alarm ? tr('Stop alarm', 'अलार्म बंद करें') : tr('Sound alarm', 'अलार्म बजाएँ')}
            </button>
            <button type="button" className="sos-act" onClick={share}><Share2 size={18} /> {tr('Share my location', 'लोकेशन भेजें')}</button>
          </div>

          <section className="sos-sec" aria-label={tr('My location', 'मेरी लोकेशन')}>
            <h3><Navigation size={14} /> {tr('My location', 'मेरी लोकेशन')}</h3>
            <div className="sos-loc">
              <div className="sos-loc-status" aria-live="polite">{status}</div>
              {pos && (
                <iframe
                  className="sos-map"
                  title={tr('Map of my location', 'मेरी लोकेशन का नक्शा')}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${pos.lng - d},${pos.lat - d},${pos.lng + d},${pos.lat + d}&layer=mapnik&marker=${pos.lat},${pos.lng}`}
                  loading="lazy"
                />
              )}
              <div className="sos-row">
                <a className="sos-act" href={pos ? mapsLink(pos) : undefined} target="_blank" rel="noreferrer" aria-disabled={!pos} style={!pos ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>
                  <MapPin size={16} /> {tr('Open in Maps', 'मैप में खोलें')}
                </a>
                <button type="button" className="sos-act" onClick={copy}><Copy size={16} /> {copied ? tr('Copied ✓', 'कॉपी हो गया ✓') : tr('Copy message', 'संदेश कॉपी करें')}</button>
              </div>
            </div>
          </section>

          <section className="sos-sec" aria-label={tr('Trusted contacts', 'भरोसेमंद संपर्क')}>
            <h3><BellRing size={14} /> {tr('Alert my trusted contacts', 'भरोसेमंद लोगों को बताएँ')}</h3>
            {contacts.length > 0 ? (
              <>
                <a className="sos-call112" style={{ fontSize: '1rem', padding: 12, marginBottom: 8 }} href={smsAll}>
                  <MessageSquare size={20} /> {tr(`Send SOS by SMS to ${contacts.length === 1 ? contacts[0].name : `all ${contacts.length}`}`, `${contacts.length === 1 ? contacts[0].name : `सभी ${contacts.length}`} को SMS से SOS भेजें`)}
                </a>
                <div className="sos-contacts">
                  {contacts.map((c, i) => (
                    <div className="sos-contact" key={`${c.phone}-${i}`}>
                      <span className="who">{c.name}<small>{c.phone}</small></span>
                      <a className="sos-icon-btn" href={`tel:${digits(c.phone)}`} aria-label={tr(`Call ${c.name}`, `${c.name} को कॉल करें`)} title={tr('Call', 'कॉल')}><Phone size={16} /></a>
                      <a className="sos-icon-btn wa" href={`https://wa.me/${waNumber(c.phone)}?text=${encodeURIComponent(message())}`} target="_blank" rel="noreferrer" aria-label={tr(`WhatsApp ${c.name}`, `${c.name} को व्हाट्सएप`)} title="WhatsApp"><MessageCircle size={16} /></a>
                      <button type="button" className="sos-icon-btn" onClick={() => removeContact(i)} aria-label={tr(`Remove ${c.name}`, `${c.name} हटाएँ`)} title={tr('Remove', 'हटाएँ')}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="sos-note" style={{ marginBottom: 8 }}>{tr('Add family or friends you trust. In an emergency, one tap sends them your location.', 'परिवार या भरोसेमंद दोस्तों को जोड़ें। मुश्किल में एक टैप से उन्हें आपकी लोकेशन चली जाएगी।')}</p>
            )}
            {contacts.length < MAX_CONTACTS && (
              <form className="sos-add" onSubmit={addContact} style={{ marginTop: 8 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tr('Name (e.g. Maa)', 'नाम (जैसे माँ)')} aria-label={tr('Contact name', 'संपर्क का नाम')} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={tr('Mobile number', 'मोबाइल नंबर')} inputMode="tel" type="tel" aria-label={tr('Mobile number', 'मोबाइल नंबर')} />
                <button type="submit" className="sos-act" style={{ flex: '0 0 auto' }} disabled={digits(phone).replace('+', '').length < 8}><Plus size={16} /> {tr('Add', 'जोड़ें')}</button>
              </form>
            )}
          </section>

          <section className="sos-sec" aria-label={tr('Helplines', 'हेल्पलाइन')}>
            <h3><Phone size={14} /> {tr('Helplines (free, 24×7)', 'हेल्पलाइन (मुफ़्त, 24×7)')}</h3>
            <div className="sos-help">
              {HELPLINES.map((h) => (
                <a key={h.no} href={`tel:${h.no}`} aria-label={`${tr('Call', 'कॉल')} ${h.no} ${tr(h.en, h.hi)}`}>
                  <b>{h.no}</b><span>{tr(h.en, h.hi)}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="sos-sec" aria-label={tr('Help near me', 'मेरे पास मदद')}>
            <h3><MapPin size={14} /> {tr('Help near me', 'मेरे पास मदद')}</h3>
            <div className="sos-row">
              <a className="sos-act" href={nearby('police station')} target="_blank" rel="noreferrer"><ShieldAlert size={16} /> {tr('Police stations', 'पुलिस स्टेशन')}</a>
              <a className="sos-act" href={nearby('hospital')} target="_blank" rel="noreferrer"><Hospital size={16} /> {tr('Hospitals', 'अस्पताल')}</a>
            </div>
          </section>

          <div>
            <p className="sos-note">{tr('Message that will be sent:', 'जो संदेश जाएगा:')}</p>
            <p className="sos-msg">{message()}</p>
            <p className="sos-note" style={{ marginTop: 6 }}>{tr('Your location is only sent when you tap Share, SMS or WhatsApp. Contacts are saved on this phone only.', 'आपकी लोकेशन तभी भेजी जाती है जब आप शेयर, SMS या व्हाट्सएप दबाती हैं। संपर्क सिर्फ़ इसी फ़ोन में सेव रहते हैं।')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SosButton;
