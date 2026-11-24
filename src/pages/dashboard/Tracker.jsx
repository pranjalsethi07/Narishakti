import React, { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  CalendarDays,
  IndianRupee,
  Pill,
  PiggyBank,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const TRACKER_STORAGE_KEY = 'trackerData';

const defaultTrackerData = {
  health: {
    activeSection: 'period',
    period: {
      lastPeriodStart: '',
      cycleLength: 28,
      periodLength: 5,
    },
    appointments: [],
    medicines: [],
  },
  finance: {
    activeSection: 'savings',
    savings: {
      goalAmount: 0,
      currentAmount: 0,
      monthlyTarget: 0,
    },
    demat: {
      created: false,
      bankName: '',
      pan: '',
      accountType: 'individual',
      dematId: '',
    },
    investments: [],
  },
};

const loadTrackerData = () => {
  const raw = localStorage.getItem(TRACKER_STORAGE_KEY);
  if (!raw) return defaultTrackerData;
  try {
    const parsed = JSON.parse(raw);
    return {
      health: {
        ...defaultTrackerData.health,
        ...parsed.health,
        period: {
          ...defaultTrackerData.health.period,
          ...(parsed.health?.period || {}),
        },
      },
      finance: {
        ...defaultTrackerData.finance,
        ...parsed.finance,
        savings: {
          ...defaultTrackerData.finance.savings,
          ...(parsed.finance?.savings || {}),
        },
        demat: {
          ...defaultTrackerData.finance.demat,
          ...(parsed.finance?.demat || {}),
        },
      },
    };
  } catch {
    return defaultTrackerData;
  }
};

const saveTrackerData = (data) => {
  localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(data));
};

const computeNextPeriodDate = (lastPeriodStart, cycleLength) => {
  if (!lastPeriodStart || !cycleLength) return '';

  const now = new Date();
  const next = new Date(lastPeriodStart);
  if (Number.isNaN(next.getTime())) return '';

  while (next <= now) {
    next.setDate(next.getDate() + Number(cycleLength));
  }

  return next.toLocaleDateString();
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Tracker = () => {
  const [activeMode, setActiveMode] = useState('health');
  const [data, setData] = useState(loadTrackerData);
  const [periodForm, setPeriodForm] = useState(data.health.period);
  const [appointmentForm, setAppointmentForm] = useState({ title: '', date: '', notes: '' });
  const [medicineForm, setMedicineForm] = useState({ name: '', dosage: '', time: '', frequency: 'Daily' });
  const [savingsForm, setSavingsForm] = useState(data.finance.savings);
  const [dematForm, setDematForm] = useState(data.finance.demat);
  const [investmentForm, setInvestmentForm] = useState({ amount: '', risk: 'moderate', horizonYears: 3 });

  const nextPeriodDate = useMemo(
    () => computeNextPeriodDate(data.health.period.lastPeriodStart, data.health.period.cycleLength),
    [data.health.period.lastPeriodStart, data.health.period.cycleLength]
  );

  const savingsProgress = useMemo(() => {
    const goal = Number(data.finance.savings.goalAmount || 0);
    const current = Number(data.finance.savings.currentAmount || 0);
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  }, [data.finance.savings.goalAmount, data.finance.savings.currentAmount]);

  const updateData = (nextData) => {
    setData(nextData);
    saveTrackerData(nextData);
  };

  const savePeriodTracker = () => {
    const nextData = {
      ...data,
      health: {
        ...data.health,
        period: {
          ...periodForm,
          cycleLength: Number(periodForm.cycleLength || 28),
          periodLength: Number(periodForm.periodLength || 5),
        },
      },
    };
    updateData(nextData);
  };

  const addAppointment = () => {
    if (!appointmentForm.title.trim() || !appointmentForm.date) return;

    const nextData = {
      ...data,
      health: {
        ...data.health,
        appointments: [
          {
            id: Date.now(),
            title: appointmentForm.title.trim(),
            date: appointmentForm.date,
            notes: appointmentForm.notes.trim(),
          },
          ...data.health.appointments,
        ],
      },
    };
    updateData(nextData);
    setAppointmentForm({ title: '', date: '', notes: '' });
  };

  const removeAppointment = (id) => {
    const nextData = {
      ...data,
      health: {
        ...data.health,
        appointments: data.health.appointments.filter((a) => a.id !== id),
      },
    };
    updateData(nextData);
  };

  const addMedicine = () => {
    if (!medicineForm.name.trim() || !medicineForm.time) return;

    const nextData = {
      ...data,
      health: {
        ...data.health,
        medicines: [
          {
            id: Date.now(),
            name: medicineForm.name.trim(),
            dosage: medicineForm.dosage.trim(),
            time: medicineForm.time,
            frequency: medicineForm.frequency,
          },
          ...data.health.medicines,
        ],
      },
    };
    updateData(nextData);
    setMedicineForm({ name: '', dosage: '', time: '', frequency: 'Daily' });
  };

  const removeMedicine = (id) => {
    const nextData = {
      ...data,
      health: {
        ...data.health,
        medicines: data.health.medicines.filter((m) => m.id !== id),
      },
    };
    updateData(nextData);
  };

  const saveSavings = () => {
    const nextData = {
      ...data,
      finance: {
        ...data.finance,
        savings: {
          goalAmount: Number(savingsForm.goalAmount || 0),
          currentAmount: Number(savingsForm.currentAmount || 0),
          monthlyTarget: Number(savingsForm.monthlyTarget || 0),
        },
      },
    };
    updateData(nextData);
  };

  const createDemat = () => {
    if (!dematForm.bankName.trim() || !dematForm.pan.trim()) return;

    const dematId = dematForm.dematId || `DMAT-${String(Date.now()).slice(-6)}`;
    const nextData = {
      ...data,
      finance: {
        ...data.finance,
        demat: {
          ...dematForm,
          created: true,
          bankName: dematForm.bankName.trim(),
          pan: dematForm.pan.trim().toUpperCase(),
          dematId,
        },
      },
    };
    updateData(nextData);
    setDematForm(nextData.finance.demat);
  };

  const addInvestmentPlan = () => {
    if (!investmentForm.amount || Number(investmentForm.amount) <= 0) return;

    const nextData = {
      ...data,
      finance: {
        ...data.finance,
        investments: [
          {
            id: Date.now(),
            amount: Number(investmentForm.amount),
            risk: investmentForm.risk,
            horizonYears: Number(investmentForm.horizonYears),
          },
          ...data.finance.investments,
        ],
      },
    };

    updateData(nextData);
    setInvestmentForm({ amount: '', risk: 'moderate', horizonYears: 3 });
  };

  const removeInvestmentPlan = (id) => {
    const nextData = {
      ...data,
      finance: {
        ...data.finance,
        investments: data.finance.investments.filter((p) => p.id !== id),
      },
    };
    updateData(nextData);
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <h1 className="h2" style={{ color: 'var(--text-dark)' }}>Tracker</h1>
        <p className="subtext">Track health routines and financial growth in one place.</p>
      </header>

      <div style={styles.modeSelector}>
        <button
          type="button"
          style={{ ...styles.modeBtn, ...(activeMode === 'health' ? styles.modeBtnActive : {}) }}
          onClick={() => setActiveMode('health')}
        >
          <Activity size={18} /> Health Tracking
        </button>
        <button
          type="button"
          style={{ ...styles.modeBtn, ...(activeMode === 'finance' ? styles.modeBtnActive : {}) }}
          onClick={() => setActiveMode('finance')}
        >
          <Wallet size={18} /> Finance Tracking
        </button>
      </div>

      {activeMode === 'health' ? (
        <div style={styles.grid}>
          <section style={styles.card}>
            <h3 style={styles.cardTitle}><CalendarDays size={20} /> Period Tracker</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Last Period Start
                <input
                  type="date"
                  style={styles.input}
                  value={periodForm.lastPeriodStart}
                  onChange={(e) => setPeriodForm((p) => ({ ...p, lastPeriodStart: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Cycle Length (days)
                <input
                  type="number"
                  min="20"
                  max="45"
                  style={styles.input}
                  value={periodForm.cycleLength}
                  onChange={(e) => setPeriodForm((p) => ({ ...p, cycleLength: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Period Length (days)
                <input
                  type="number"
                  min="2"
                  max="10"
                  style={styles.input}
                  value={periodForm.periodLength}
                  onChange={(e) => setPeriodForm((p) => ({ ...p, periodLength: e.target.value }))}
                />
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={savePeriodTracker}>Save Period Data</button>
            <p className="subtext" style={{ marginTop: '12px' }}>
              Next expected period: <strong>{nextPeriodDate || 'Add period details first'}</strong>
            </p>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}><CalendarDays size={20} /> Health Appointments</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Appointment Name
                <input
                  style={styles.input}
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Gynecologist Follow-up"
                />
              </label>
              <label style={styles.field}>
                Date
                <input
                  type="date"
                  style={styles.input}
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm((f) => ({ ...f, date: e.target.value }))}
                />
              </label>
              <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
                Notes
                <input
                  style={styles.input}
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Bring previous reports"
                />
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={addAppointment}><Plus size={16} /> Add Appointment</button>

            <div style={styles.listWrap}>
              {data.health.appointments.length === 0 ? (
                <p className="subtext">No appointments added yet.</p>
              ) : (
                data.health.appointments.map((a) => (
                  <div key={a.id} style={styles.listItem}>
                    <div>
                      <strong>{a.title}</strong>
                      <p className="subtext">{a.date}{a.notes ? ` • ${a.notes}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => removeAppointment(a.id)} style={styles.iconBtn}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}><Pill size={20} /> Medicine Tracker</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Medicine Name
                <input
                  style={styles.input}
                  value={medicineForm.name}
                  onChange={(e) => setMedicineForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Dosage
                <input
                  style={styles.input}
                  value={medicineForm.dosage}
                  onChange={(e) => setMedicineForm((f) => ({ ...f, dosage: e.target.value }))}
                  placeholder="1 tablet"
                />
              </label>
              <label style={styles.field}>
                Time
                <input
                  type="time"
                  style={styles.input}
                  value={medicineForm.time}
                  onChange={(e) => setMedicineForm((f) => ({ ...f, time: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Frequency
                <select
                  style={styles.input}
                  value={medicineForm.frequency}
                  onChange={(e) => setMedicineForm((f) => ({ ...f, frequency: e.target.value }))}
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="As Needed">As Needed</option>
                </select>
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={addMedicine}><Plus size={16} /> Add Medicine</button>

            <div style={styles.listWrap}>
              {data.health.medicines.length === 0 ? (
                <p className="subtext">No medicines tracked yet.</p>
              ) : (
                data.health.medicines.map((m) => (
                  <div key={m.id} style={styles.listItem}>
                    <div>
                      <strong>{m.name}</strong>
                      <p className="subtext">{m.dosage || 'Dosage N/A'} • {m.time} • {m.frequency}</p>
                    </div>
                    <button type="button" onClick={() => removeMedicine(m.id)} style={styles.iconBtn}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        <div style={styles.grid}>
          <section style={styles.card}>
            <h3 style={styles.cardTitle}><PiggyBank size={20} /> Savings Tracker</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Savings Goal Amount (INR)
                <input
                  type="number"
                  min="0"
                  style={styles.input}
                  value={savingsForm.goalAmount}
                  onChange={(e) => setSavingsForm((s) => ({ ...s, goalAmount: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Current Saved Amount (INR)
                <input
                  type="number"
                  min="0"
                  style={styles.input}
                  value={savingsForm.currentAmount}
                  onChange={(e) => setSavingsForm((s) => ({ ...s, currentAmount: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Monthly Saving Target (INR)
                <input
                  type="number"
                  min="0"
                  style={styles.input}
                  value={savingsForm.monthlyTarget}
                  onChange={(e) => setSavingsForm((s) => ({ ...s, monthlyTarget: e.target.value }))}
                />
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={saveSavings}><BadgeCheck size={16} /> Save Savings Plan</button>

            <div style={{ marginTop: '16px' }}>
              <p className="subtext">Goal: <strong>{formatCurrency(data.finance.savings.goalAmount)}</strong></p>
              <p className="subtext">Saved: <strong>{formatCurrency(data.finance.savings.currentAmount)}</strong></p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${savingsProgress}%` }}></div>
              </div>
              <p className="subtext" style={{ marginTop: '6px' }}>{savingsProgress}% complete</p>
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}><Wallet size={20} /> Demat + Bank Link</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                Bank Name
                <input
                  style={styles.input}
                  value={dematForm.bankName}
                  onChange={(e) => setDematForm((d) => ({ ...d, bankName: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                PAN
                <input
                  style={styles.input}
                  value={dematForm.pan}
                  onChange={(e) => setDematForm((d) => ({ ...d, pan: e.target.value.toUpperCase() }))}
                  placeholder="ABCDE1234F"
                />
              </label>
              <label style={styles.field}>
                Account Type
                <select
                  style={styles.input}
                  value={dematForm.accountType}
                  onChange={(e) => setDematForm((d) => ({ ...d, accountType: e.target.value }))}
                >
                  <option value="individual">Individual</option>
                  <option value="joint">Joint</option>
                </select>
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={createDemat}><BadgeCheck size={16} /> {dematForm.created ? 'Update Demat Profile' : 'Create Demat Account'}</button>

            {data.finance.demat.created && (
              <div style={styles.noteBox}>
                <p style={{ margin: 0 }}>
                  Demat linked successfully: <strong>{data.finance.demat.dematId}</strong>
                </p>
              </div>
            )}
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}><TrendingUp size={20} /> Start Investing</h3>
            <div style={styles.formGrid}>
              <label style={styles.field}>
                SIP Amount (INR)
                <input
                  type="number"
                  min="100"
                  style={styles.input}
                  value={investmentForm.amount}
                  onChange={(e) => setInvestmentForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </label>
              <label style={styles.field}>
                Risk Profile
                <select
                  style={styles.input}
                  value={investmentForm.risk}
                  onChange={(e) => setInvestmentForm((f) => ({ ...f, risk: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label style={styles.field}>
                Horizon (Years)
                <input
                  type="number"
                  min="1"
                  max="30"
                  style={styles.input}
                  value={investmentForm.horizonYears}
                  onChange={(e) => setInvestmentForm((f) => ({ ...f, horizonYears: e.target.value }))}
                />
              </label>
            </div>
            <button className="btn btn-primary" type="button" onClick={addInvestmentPlan}><IndianRupee size={16} /> Add Investment Plan</button>

            <div style={styles.listWrap}>
              {data.finance.investments.length === 0 ? (
                <p className="subtext">No investment plans yet.</p>
              ) : (
                data.finance.investments.map((p) => (
                  <div key={p.id} style={styles.listItem}>
                    <div>
                      <strong>{formatCurrency(p.amount)} / month</strong>
                      <p className="subtext">Risk: {p.risk} • {p.horizonYears} years</p>
                    </div>
                    <button type="button" onClick={() => removeInvestmentPlan(p.id)} style={styles.iconBtn}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: 'none', margin: '0 auto' },
  header: { marginBottom: '24px' },
  modeSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  modeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '9999px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-dark)',
    fontWeight: '600',
  },
  modeBtnActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    borderColor: 'var(--primary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.08rem',
    marginBottom: '14px',
    color: 'var(--text-dark)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
    marginBottom: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.86rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: 'var(--bg-color)',
  },
  listWrap: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-color)',
  },
  iconBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface)',
    color: 'var(--danger)',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    borderRadius: '9999px',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    marginTop: '6px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #9b63e8 0%, #ff8fab 100%)',
  },
  noteBox: {
    marginTop: '12px',
    border: '1px solid #c6f6d5',
    backgroundColor: '#f0fff4',
    color: 'var(--success)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontWeight: '600',
  },
};

export default Tracker;
