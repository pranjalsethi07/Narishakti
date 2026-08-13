import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Mic,
  PhoneForwarded,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const WhatsApp = () => {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');
  const [testMessage, setTestMessage] = useState('Mujhe PM Jan Dhan Yojana ke basics batayein');
  const [testReply, setTestReply] = useState('');
  const [testError, setTestError] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const loadStatus = async () => {
    setStatusLoading(true);
    setStatusError('');
    try {
      const response = await apiFetch('/api/whatsapp/status');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load WhatsApp status.');
      }
      setStatus(data);
    } catch (error) {
      setStatusError(error?.message || 'Unable to fetch WhatsApp status.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const formattedPhone = useMemo(() => {
    const digits = (status?.whatsappNumber || '').replace(/[^\d]/g, '');
    return digits;
  }, [status]);

  const openWhatsAppHref = useMemo(() => {
    if (!formattedPhone) return '#';
    const joinText = status?.sandboxJoinCode ? `join ${status.sandboxJoinCode}` : 'Hi NariShakti';
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(joinText)}`;
  }, [formattedPhone, status]);

  const handleTestBot = async () => {
    const trimmed = testMessage.trim();
    if (!trimmed) return;

    setIsTesting(true);
    setTestReply('');
    setTestError('');

    try {
      const response = await apiFetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'WhatsApp bot test failed.');
      }
      setTestReply(data?.reply || 'No reply received from bot.');
    } catch (error) {
      setTestError(error?.message || 'WhatsApp bot test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={{marginBottom: '32px'}}>
        <h1 className="h2" style={{color: 'var(--text-dark)'}}>WhatsApp Integration</h1>
        <p className="subtext">Connect Twilio WhatsApp webhook and chat with NariShakti directly in WhatsApp</p>
      </header>

      <div style={styles.flexContainer}>
        <div style={styles.card}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Smartphone color="#25D366" />
            Connect WhatsApp Bot
          </h2>

          <div style={{
            ...styles.statusPill,
            backgroundColor: status?.configured ? '#e8f8ef' : '#fff4e5',
            color: status?.configured ? '#1f7a46' : '#8a5a00',
            borderColor: status?.configured ? '#b7ebcb' : '#ffe0b2'
          }}>
            {status?.configured ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {status?.configured ? 'Configured: Ready to receive WhatsApp messages' : 'Setup incomplete: Check steps below'}
          </div>

          {statusError && <p style={styles.errorText}>{statusError}</p>}
          {statusLoading && <p className="subtext">Checking WhatsApp configuration...</p>}

          <div style={styles.instructionBox}>
            <div style={styles.stepCircle}>1</div>
            <div>
              <h4>Set webhook in Twilio Sandbox</h4>
              <p className="subtext" style={{marginBottom: '8px'}}>
                Configure "When a message comes in" URL to:
              </p>
              <div style={styles.codeBox}>
                {status?.webhookUrl || 'Set PUBLIC_BASE_URL in .env first, then restart server'}
              </div>
              <p className="subtext" style={{marginTop: '8px'}}>
                Use POST method in Twilio and save configuration.
              </p>
            </div>
          </div>

          <div style={styles.instructionBox}>
            <div style={styles.stepCircle}>2</div>
            <div>
              <h4>Join Twilio WhatsApp Sandbox</h4>
              <p className="subtext">
                From your phone, send this join code to Twilio sandbox number.
              </p>
              <div style={styles.codeBox}>
                {status?.hasJoinCode ? `join ${status.sandboxJoinCode}` : 'Set TWILIO_SANDBOX_JOIN_CODE in .env'}
              </div>
              <div style={styles.qrPlaceholder}>
                <QrCode size={80} color="var(--text-muted)" />
                <p>Scan in Twilio Console</p>
              </div>
            </div>
          </div>

          <a
            href={openWhatsAppHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{
              width: '100%',
              backgroundColor: '#25D366',
              color: '#fff',
              pointerEvents: formattedPhone ? 'auto' : 'none',
              opacity: formattedPhone ? 1 : 0.6,
            }}
          >
            <PhoneForwarded size={18} /> Open WhatsApp <ExternalLink size={16} />
          </a>

          <button
            className="btn btn-secondary"
            type="button"
            style={{ width: '100%', marginTop: '12px' }}
            onClick={loadStatus}
          >
            Refresh Status
          </button>
        </div>

        <div style={styles.mockPhone}>
          <div style={styles.mockScreen}>
            <div style={styles.mockHeader}>
              <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: '#075E54', fontWeight: 'bold', fontSize: '0.8rem'}}>NS</span>
              </div>
              <span style={{color: '#fff', fontWeight: '600'}}>NariShakti Didi</span>
            </div>
            <div style={styles.mockChatArea}>
              <div style={styles.mockMsgIn}>
                <p>Namaste! Main NariShakti AI hu. Aap mujhe WhatsApp par health, finance ya schemes ke baare me puch sakte hain.</p>
              </div>
              <div style={styles.mockMsgOut}>
                <p>{testMessage || 'Mujhe PM Jan Dhan Yojana ke basics batayein'}</p>
              </div>
              <div style={styles.mockMsgIn}>
                <p>{testReply || 'Tap "Test Bot Reply" to validate AI response with backend.'}</p>
              </div>
              {testError && <div style={{ ...styles.mockMsgIn, backgroundColor: '#fff1f1' }}><p>{testError}</p></div>}
            </div>
            <div style={styles.mockInputArea}>
              <input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type test message"
                style={styles.testInput}
                disabled={isTesting}
              />
              <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <button type="button" onClick={handleTestBot} disabled={isTesting} style={styles.testBtn}>
                  <Mic size={16} color="#fff" />
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleTestBot}
              disabled={isTesting || !testMessage.trim()}
              style={{ margin: '0 8px 8px', fontSize: '0.9rem' }}
            >
              {isTesting ? 'Testing...' : 'Test Bot Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  flexContainer: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: 'var(--surface)',
    padding: '32px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '9999px',
    border: '1px solid',
    marginBottom: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  codeBox: {
    width: '100%',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#f7fafc',
    padding: '10px 12px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '0.83rem',
    color: '#2d3748',
    wordBreak: 'break-all',
  },
  errorText: {
    color: '#c53030',
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  instructionBox: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  stepCircle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  qrPlaceholder: {
    marginTop: '16px',
    width: '150px',
    height: '150px',
    border: '2px dashed var(--border-color)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  mockPhone: {
    width: '300px',
    height: '550px',
    backgroundColor: '#000',
    borderRadius: '32px',
    padding: '8px',
    boxShadow: 'var(--shadow-lg)'
  },
  mockScreen: {
    height: '100%',
    backgroundColor: '#efeae2',
    borderRadius: '24px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  mockHeader: {
    backgroundColor: '#075E54',
    padding: '32px 16px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  mockChatArea: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  mockMsgIn: {
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '0 12px 12px 12px',
    fontSize: '0.9rem',
    maxWidth: '85%',
    alignSelf: 'flex-start',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  mockMsgOut: {
    backgroundColor: '#dcf8c6',
    padding: '12px',
    borderRadius: '12px 0 12px 12px',
    fontSize: '0.9rem',
    maxWidth: '85%',
    alignSelf: 'flex-end',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  mockInputArea: {
    backgroundColor: '#f0f0f0',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '8px',
    borderRadius: '24px',
    gap: '8px',
  },
  testInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '0.85rem',
    color: '#2d3748',
  },
  testBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
};

export default WhatsApp;
