import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, MessageCircle, X } from 'lucide-react';
import Logo from './Logo';
import { NAV } from './navConfig';
import SosButton from './sos/SosButton';

const MIN_WIDTH = 76; // icon-only rail
const MAX_WIDTH = 420;
const RAIL_BELOW = 140; // narrower than this shows icons only
const SNAP_OPEN = 200; // when you let go while open, never settle narrower than this
const DEFAULT_OPEN = 260;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// On phones the sidebar is a drawer that slides in over the page (isMobile),
// opened from the header's menu button. On bigger screens it sits beside the page.
const Sidebar = ({ isMobile = false, mobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname.replace(/\/+$/, '') === '/dashboard';

  const [width, setWidth] = useState(isHome ? DEFAULT_OPEN : MIN_WIDTH);
  const [openWidth, setOpenWidth] = useState(DEFAULT_OPEN); // width to return to when expanding
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const collapsed = !isMobile && width < RAIL_BELOW; // the drawer always shows full labels

  // Automatic only when you move between the dashboard home and a section:
  // open on the home, collapsed inside a section. Moving between sections keeps
  // whatever width you chose, so an expanded menu stays expanded while you browse.
  const [wasHome, setWasHome] = useState(isHome);
  if (isHome !== wasHome) {
    setWasHome(isHome);
    setWidth(isHome ? openWidth : MIN_WIDTH);
  }

  const toggleCollapsed = useCallback(() => {
    if (width < RAIL_BELOW) {
      setWidth(openWidth);
    } else {
      setOpenWidth(width);
      setWidth(MIN_WIDTH);
    }
  }, [width, openWidth]);

  // Drag the sidebar's right edge to make it narrower or wider.
  const startDrag = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startWidth: width };
    setDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  const moveDrag = (e) => {
    if (!dragRef.current) return;
    setWidth(clamp(dragRef.current.startWidth + e.clientX - dragRef.current.startX, MIN_WIDTH, MAX_WIDTH));
  };
  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (width < RAIL_BELOW) {
      setWidth(MIN_WIDTH);
    } else {
      const settled = Math.max(width, SNAP_OPEN);
      setWidth(settled);
      setOpenWidth(settled);
    }
  };
  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); toggleCollapsed(); return; }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (collapsed) { setWidth(openWidth); return; }
      const next = clamp(width + 24, SNAP_OPEN, MAX_WIDTH);
      setWidth(next);
      setOpenWidth(next);
    } else if (e.key === 'ArrowLeft' && !collapsed) {
      e.preventDefault();
      if (width - 24 < SNAP_OPEN) { setOpenWidth(width); setWidth(MIN_WIDTH); return; }
      setWidth(width - 24);
      setOpenWidth(width - 24);
    }
  };
  useEffect(() => () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Ctrl+B (Cmd+B on Mac) shrinks or expands the menu, unless you are typing.
  useEffect(() => {
    if (isMobile) return undefined;
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'b') return;
      const el = e.target;
      if (el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return;
      e.preventDefault();
      toggleCollapsed();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleCollapsed, isMobile]);

  // Escape closes the phone drawer.
  useEffect(() => {
    if (!isMobile || !mobileOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onMobileClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, mobileOpen, onMobileClose]);
  const toggleLabel = collapsed
    ? (lang === 'hi' ? 'मेनू खोलें' : 'Expand menu')
    : (lang === 'hi' ? 'मेनू छोटा करें' : 'Collapse menu');

  // Groups open and close. A group you closed reopens when you navigate into it.
  const [closedGroups, setClosedGroups] = useState([]);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    const active = NAV.find((n) => n.type === 'group' && n.items.some((i) => pathname.startsWith(i.path)));
    if (active && closedGroups.includes(active.id)) {
      setClosedGroups(closedGroups.filter((g) => g !== active.id));
    }
  }
  const toggleGroup = (id) =>
    setClosedGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const renderLink = (item, nested = false) => {
    const name = t(item.key);
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/dashboard'} // Dashboard home only matches exact
        className="sidebar-link"
        onClick={isMobile ? onMobileClose : undefined}
        title={collapsed ? name : undefined}
        aria-label={name}
        style={({ isActive }) => ({
          ...styles.link,
          ...(nested ? styles.linkNested : {}),
          ...(collapsed ? styles.linkCollapsed : {}),
          ...(isActive ? styles.activeLink : {}),
        })}
      >
        <item.icon size={nested ? 18 : 20} style={{ flexShrink: 0 }} />
        {!collapsed && name}
      </NavLink>
    );
  };

  const asideStyle = isMobile
    ? { ...styles.sidebar, ...styles.drawer, transform: mobileOpen ? 'translateX(0)' : 'translateX(-105%)', boxShadow: mobileOpen ? '0 0 40px rgba(0,0,0,0.35)' : 'none' }
    : { ...styles.sidebar, width: `${width}px`, transition: dragging ? 'none' : 'width 0.25s ease' };

  return (
    <>
      {isMobile && mobileOpen && <div style={styles.backdrop} onClick={onMobileClose} aria-hidden="true" />}
    <aside style={asideStyle} inert={isMobile && !mobileOpen ? true : undefined} aria-label={lang === 'hi' ? 'मुख्य मेनू' : 'Main menu'}>
      <div style={{ ...styles.header, padding: collapsed ? '16px 8px' : '24px' }}>
        <Logo width={collapsed ? 48 : 120} showText={!collapsed} />
      </div>

      {isMobile ? (
        <button
          type="button"
          onClick={onMobileClose}
          style={{ ...styles.toggleBtn, alignSelf: 'flex-end', margin: '12px 16px 0' }}
          aria-label={lang === 'hi' ? 'मेनू बंद करें' : 'Close menu'}
        >
          <X size={20} />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleCollapsed}
          style={{ ...styles.toggleBtn, alignSelf: collapsed ? 'center' : 'flex-end', margin: collapsed ? '12px 0 0' : '12px 16px 0' }}
          title={`${toggleLabel} (Ctrl+B)`}
          aria-label={toggleLabel}
          aria-keyshortcuts="Control+B"
          aria-expanded={!collapsed}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      )}

      <nav style={{ ...styles.nav, padding: collapsed ? '12px 10px' : '14px 12px' }}>
        {collapsed
          ? NAV.flatMap((node, i) => {
              // Icon rail: no group headings, just a thin divider around each group.
              if (node.type === 'link') {
                const afterGroup = NAV[i - 1]?.type === 'group';
                return [...(afterGroup ? [<div key={`${node.key}-sep`} style={styles.railDivider} />] : []), renderLink(node)];
              }
              return [<div key={`${node.id}-sep`} style={styles.railDivider} />, ...node.items.map((item) => renderLink(item))];
            })
          : NAV.map((node) => {
              if (node.type === 'link') return renderLink(node);
              const open = !closedGroups.includes(node.id);
              return (
                <div key={node.id} style={styles.group}>
                  <button
                    type="button"
                    className="sidebar-link"
                    style={styles.groupHeader}
                    onClick={() => toggleGroup(node.id)}
                    aria-expanded={open}
                    aria-controls={`nav-${node.id}`}
                  >
                    <span style={{ ...styles.groupIcon, backgroundColor: node.color }}>
                      <node.icon size={16} color="#fff" />
                    </span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{t(node.labelKey)}</span>
                    <ChevronDown size={16} color="var(--text-muted)" style={{ transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                  </button>
                  <div id={`nav-${node.id}`} style={{ ...styles.groupBody, gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <div style={{ overflow: 'hidden', visibility: open ? 'visible' : 'hidden', transition: `visibility 0s linear ${open ? '0s' : '0.25s'}` }}>
                      <div style={{ ...styles.children, borderLeftColor: node.color }}>
                        {node.items.map((item) => renderLink(item, true))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </nav>

      <SosButton variant={collapsed ? 'rail' : 'full'} />

      {collapsed ? (
        <button
          type="button"
          style={styles.whatsappIconBtn}
          onClick={() => { navigate('/dashboard/whatsapp'); if (isMobile) onMobileClose(); }}
          title={lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
          aria-label={lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
        >
          <MessageCircle size={20} />
        </button>
      ) : (
        <div style={styles.whatsappCard}>
          <h4>💬 {lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{lang === 'hi' ? 'मिस्ड कॉल दें!' : 'Give a missed call!'}</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '8px' }} onClick={() => { navigate('/dashboard/whatsapp'); if (isMobile) onMobileClose(); }}>
            {lang === 'hi' ? 'कनेक्ट करें' : 'Connect'}
          </button>
        </div>
      )}

      {/* Drag this edge to resize. Double-click, or press Enter when focused, to collapse or expand. */}
      {!isMobile && <div
        role="separator"
        aria-orientation="vertical"
        aria-label={lang === 'hi' ? 'मेनू की चौड़ाई बदलें' : 'Resize menu'}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={Math.round(width)}
        tabIndex={0}
        className={`sidebar-resize${dragging ? ' dragging' : ''}`}
        style={styles.resizeHandle}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={toggleCollapsed}
        onKeyDown={handleKey}
        title={lang === 'hi' ? 'खींचकर चौड़ाई बदलें' : 'Drag to resize'}
      />}
    </aside>
    </>
  );
};

const styles = {
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflow: 'hidden', transition: 'width 0.25s ease' },
  drawer: { position: 'fixed', top: 0, left: 0, width: 'min(300px, 86vw)', zIndex: 1100, transition: 'transform 0.25s ease, box-shadow 0.25s ease' },
  backdrop: { position: 'fixed', inset: 0, backgroundColor: 'rgba(26, 18, 40, 0.5)', zIndex: 1090 },
  toggleBtn: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' },
  resizeHandle: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '6px', cursor: 'col-resize', touchAction: 'none', zIndex: 5 },
  linkCollapsed: { justifyContent: 'center', padding: '12px 0', gap: 0 },
  whatsappIconBtn: { margin: '16px auto', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6ffe6', border: '1px solid #b3ffb3', color: '#1a7f3c' },
  header: { padding: '24px', borderBottom: '1px solid var(--border-color)' },
  nav: { flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' },
  link: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: 'var(--radius-md)', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', transition: 'background-color 0.2s, color 0.2s' },
  linkNested: { padding: '9px 12px', fontSize: '0.95rem' },
  activeLink: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: '600', boxShadow: 'inset 3px 0 0 var(--primary)' },
  group: { display: 'flex', flexDirection: 'column', marginTop: '6px' },
  groupHeader: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.98rem', fontFamily: 'inherit', cursor: 'pointer' },
  groupIcon: { width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  groupBody: { display: 'grid', transition: 'grid-template-rows 0.25s ease' },
  children: { display: 'flex', flexDirection: 'column', gap: '2px', margin: '2px 0 4px 26px', paddingLeft: '8px', borderLeft: '2px solid var(--border-color)' },
  railDivider: { height: '1px', backgroundColor: 'var(--border-color)', margin: '6px 8px' },
  whatsappCard: { margin: '16px', padding: '16px', backgroundColor: '#e6ffe6', borderRadius: 'var(--radius-md)', border: '1px solid #b3ffb3', textAlign: 'center' }
};

export default Sidebar;
