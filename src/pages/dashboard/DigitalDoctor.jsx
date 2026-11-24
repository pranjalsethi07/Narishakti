import React, { useMemo, useState } from 'react';
import {
  Brain,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldPlus,
  Ticket,
  UserRound,
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const PARCHI_STORAGE_KEY = 'digitalDoctorParchiBookings';

const DOCTORS = [
  {
    id: 'g-1',
    hospitalType: 'govt',
    doctorName: 'Dr. Anjali Verma',
    specialty: 'Gynecologist',
    hospitalName: 'District Women Government Hospital',
    city: 'Delhi',
    area: 'Karol Bagh',
    address: 'Block C, Karol Bagh, New Delhi',
    days: 'Mon, Tue, Thu, Sat',
    time: '09:00 AM - 01:00 PM',
    fee: 40,
    experienceYears: 14,
    education: 'MBBS, MD (Obstetrics & Gynecology) - AIIMS',
    languages: 'Hindi, English',
    about:
      'Specializes in menstrual disorders, PCOS guidance, pregnancy checkups, and post-partum care. Known for clear counselling in easy language.',
  },
  {
    id: 'g-2',
    hospitalType: 'govt',
    doctorName: 'Dr. Meera Khan',
    specialty: 'Mental Therapist',
    hospitalName: 'State Mental Wellness Centre',
    city: 'Delhi',
    area: 'Lajpat Nagar',
    address: 'Sector 2, Lajpat Nagar, New Delhi',
    days: 'Mon to Fri',
    time: '11:00 AM - 04:00 PM',
    fee: 30,
    experienceYears: 11,
    education: 'MPhil Clinical Psychology, RCI Registered',
    languages: 'Hindi, English, Urdu',
    about:
      'Supports women facing anxiety, stress, relationship conflict, and trauma recovery with practical therapy plans and weekly follow-up.',
  },
  {
    id: 'g-3',
    hospitalType: 'govt',
    doctorName: 'Dr. Neha Rathi',
    specialty: 'Dermatologist',
    hospitalName: 'Civil Skin and Health Unit',
    city: 'Lucknow',
    area: 'Hazratganj',
    address: 'Near City Library, Hazratganj, Lucknow',
    days: 'Tue, Wed, Fri',
    time: '10:00 AM - 02:00 PM',
    fee: 35,
    experienceYears: 9,
    education: 'MBBS, MD Dermatology',
    languages: 'Hindi, English',
    about:
      'Treats acne, fungal infection, rashes, and women-specific skin conditions. Focuses on low-cost medicine options from govt pharmacy.',
  },
  {
    id: 'p-1',
    hospitalType: 'private',
    doctorName: 'Dr. Ritu Sharma',
    specialty: 'Gynecologist',
    hospitalName: 'Aarogya Women Care',
    city: 'Delhi',
    area: 'Dwarka',
    address: 'Plot 19, Sector 8, Dwarka, New Delhi',
    days: 'Mon to Sat',
    time: '05:00 PM - 09:00 PM',
    fee: 700,
    experienceYears: 16,
    education: 'MBBS, DGO, Fellowship in IVF',
    languages: 'Hindi, English',
    about:
      'Expert in infertility counseling, pregnancy planning, and high-risk antenatal monitoring. Offers digital reports and follow-up support.',
  },
  {
    id: 'p-2',
    hospitalType: 'private',
    doctorName: 'Dr. Priyanka Rao',
    specialty: 'Mental Therapist',
    hospitalName: 'MindEase Clinic',
    city: 'Bengaluru',
    area: 'Indiranagar',
    address: '100 Feet Road, Indiranagar, Bengaluru',
    days: 'Tue to Sun',
    time: '02:00 PM - 08:00 PM',
    fee: 1200,
    experienceYears: 13,
    education: 'PsyD, CBT Specialist',
    languages: 'English, Hindi, Kannada',
    about:
      'Helps with panic attacks, burnout, depression, and grief therapy. Provides short structured sessions with home exercises.',
  },
  {
    id: 'p-3',
    hospitalType: 'private',
    doctorName: 'Dr. Isha Bansal',
    specialty: 'General Physician',
    hospitalName: 'Nayi Disha Multispeciality',
    city: 'Lucknow',
    area: 'Gomti Nagar',
    address: 'Vibhuti Khand, Gomti Nagar, Lucknow',
    days: 'Mon to Sat',
    time: '09:30 AM - 12:30 PM',
    fee: 600,
    experienceYears: 10,
    education: 'MBBS, DNB Family Medicine',
    languages: 'Hindi, English',
    about:
      'First-contact doctor for fever, weakness, infections, and chronic condition monitoring. Refers to specialists after initial assessment.',
  },
  {
    id: 'g-4',
    hospitalType: 'govt',
    doctorName: 'Dr. Sangeeta Nair',
    specialty: 'Endocrinologist',
    hospitalName: 'Metro Government Specialty Hospital',
    city: 'Bengaluru',
    area: 'Jayanagar',
    address: '4th Block, Jayanagar, Bengaluru',
    days: 'Mon, Wed, Fri',
    time: '10:30 AM - 03:00 PM',
    fee: 50,
    experienceYears: 12,
    education: 'MBBS, MD Medicine, DM Endocrinology',
    languages: 'English, Hindi, Kannada',
    about:
      'Consults for thyroid, diabetes, hormonal issues, and menstrual-endocrine imbalance with government-supported treatment plans.',
  },
];

const SYMPTOM_FALLBACK_MAP = {
  period: ['Gynecologist'],
  menstruation: ['Gynecologist'],
  pregnancy: ['Gynecologist'],
  pcos: ['Gynecologist', 'Endocrinologist'],
  thyroid: ['Endocrinologist'],
  diabetes: ['Endocrinologist', 'General Physician'],
  stress: ['Mental Therapist'],
  anxiety: ['Mental Therapist'],
  depression: ['Mental Therapist'],
  mood: ['Mental Therapist'],
  rash: ['Dermatologist'],
  acne: ['Dermatologist'],
  itching: ['Dermatologist'],
  fever: ['General Physician'],
  weakness: ['General Physician'],
};

const loadBookings = () => {
  const raw = localStorage.getItem(PARCHI_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveBookings = (items) => {
  localStorage.setItem(PARCHI_STORAGE_KEY, JSON.stringify(items));
};

const getUniqueCities = (doctors) => Array.from(new Set(doctors.map((d) => d.city))).sort();

const getSpecialtyFromSymptomsFallback = (text) => {
  const lower = String(text || '').toLowerCase();
  const set = new Set();

  Object.entries(SYMPTOM_FALLBACK_MAP).forEach(([keyword, specialties]) => {
    if (lower.includes(keyword)) {
      specialties.forEach((s) => set.add(s));
    }
  });

  return Array.from(set);
};

const doctorMatchesSpecialties = (doctor, specialties) => {
  if (!specialties.length) return true;
  return specialties.some((s) => doctor.specialty.toLowerCase() === s.toLowerCase());
};

const DigitalDoctor = () => {
  const [city, setCity] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [paymentDoctor, setPaymentDoctor] = useState(null);
  const [bookings, setBookings] = useState(loadBookings);
  const [symptoms, setSymptoms] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiMatchedSpecialties, setAiMatchedSpecialties] = useState([]);
  const [paymentError, setPaymentError] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    fullName: localStorage.getItem('userName') || '',
    age: '',
    phone: '',
    paymentMethod: 'UPI',
    upiId: '',
    cardLast4: '',
  });

  const cityOptions = useMemo(() => ['All', ...getUniqueCities(DOCTORS)], []);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();

    return DOCTORS.filter((doctor) => {
      const cityMatch = city === 'All' ? true : doctor.city === city;
      const queryMatch = !q
        ? true
        : [doctor.doctorName, doctor.specialty, doctor.hospitalName, doctor.area]
            .join(' ')
            .toLowerCase()
            .includes(q);
      const aiMatch = doctorMatchesSpecialties(doctor, aiMatchedSpecialties);
      return cityMatch && queryMatch && aiMatch;
    });
  }, [city, query, aiMatchedSpecialties]);

  const govtDoctors = filteredDoctors.filter((d) => d.hospitalType === 'govt');
  const privateDoctors = filteredDoctors.filter((d) => d.hospitalType === 'private');

  const bookedDoctorIds = useMemo(() => new Set(bookings.map((b) => b.doctorId)), [bookings]);

  const openParchiDialog = (doctor, closeProfile = false) => {
    if (bookedDoctorIds.has(doctor.id)) return;

    setPaymentDoctor(doctor);
    setPaymentError('');
    if (closeProfile) setSelectedDoctor(null);
  };

  const confirmParchiPayment = () => {
    if (!paymentDoctor) return;

    const trimmedName = paymentForm.fullName.trim();
    const trimmedPhone = paymentForm.phone.trim();
    const trimmedAge = String(paymentForm.age || '').trim();

    if (!trimmedName) {
      setPaymentError('Please enter full name.');
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      setPaymentError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!trimmedAge || Number(trimmedAge) < 10 || Number(trimmedAge) > 100) {
      setPaymentError('Please enter a valid age between 10 and 100.');
      return;
    }

    if (paymentForm.paymentMethod === 'UPI' && !paymentForm.upiId.trim()) {
      setPaymentError('Please enter your UPI ID.');
      return;
    }

    if (paymentForm.paymentMethod === 'Card' && !/^\d{4}$/.test(paymentForm.cardLast4.trim())) {
      setPaymentError('Please enter last 4 digits of your card.');
      return;
    }

    if (bookedDoctorIds.has(paymentDoctor.id)) {
      setPaymentDoctor(null);
      setPaymentError('');
      return;
    }

    const token = `P-${Date.now().toString().slice(-6)}`;
    const newBooking = {
      id: Date.now(),
      doctorId: paymentDoctor.id,
      doctorName: paymentDoctor.doctorName,
      specialty: paymentDoctor.specialty,
      hospitalName: paymentDoctor.hospitalName,
      city: paymentDoctor.city,
      amountPaid: paymentDoctor.fee,
      token,
      patientName: trimmedName,
      patientAge: Number(trimmedAge),
      patientPhone: trimmedPhone,
      paymentMethod: paymentForm.paymentMethod,
      paymentReference:
        paymentForm.paymentMethod === 'UPI'
          ? paymentForm.upiId.trim()
          : `Card-XXXX-${paymentForm.cardLast4.trim()}`,
      createdAt: new Date().toISOString(),
    };

    const next = [newBooking, ...bookings];
    setBookings(next);
    saveBookings(next);

    setPaymentDoctor(null);
    setPaymentError('');
    setPaymentForm((prev) => ({
      ...prev,
      age: '',
      phone: '',
      upiId: '',
      cardLast4: '',
    }));
  };

  const findSpecialistsWithAI = async () => {
    if (!symptoms.trim()) {
      setAiError('Please describe your symptoms/disease first.');
      return;
    }

    setAiLoading(true);
    setAiError('');

    const allowedSpecialties = Array.from(new Set(DOCTORS.map((d) => d.specialty)));

    const prompt = [
      'You are a doctor recommendation triage assistant.',
      `Allowed specialties only: ${allowedSpecialties.join(', ')}`,
      `User symptoms: ${symptoms.trim()}`,
      '',
      'Return ONLY valid JSON in this format:',
      '{"specialties":["Gynecologist","Mental Therapist"],"reason":"short reason"}',
      'Rules:',
      '- Pick 1 to 3 specialties from allowed list only',
      '- No markdown, no extra text',
    ].join('\n');

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Failed to fetch AI doctor match.');

      const raw = String(payload?.reply || '');
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      let parsed = null;

      if (start !== -1 && end !== -1 && end > start) {
        parsed = JSON.parse(raw.slice(start, end + 1));
      }

      const resultSpecialties = Array.isArray(parsed?.specialties)
        ? parsed.specialties.filter((item) => allowedSpecialties.includes(item))
        : [];

      if (!resultSpecialties.length) {
        const fallback = getSpecialtyFromSymptomsFallback(symptoms);
        setAiMatchedSpecialties(fallback);
        if (!fallback.length) {
          setAiError('Could not map symptoms to specialists. Try adding more details.');
        }
      } else {
        setAiMatchedSpecialties(resultSpecialties);
      }
    } catch {
      const fallback = getSpecialtyFromSymptomsFallback(symptoms);
      setAiMatchedSpecialties(fallback);
      if (!fallback.length) {
        setAiError('AI mapping failed. Please try again in a moment.');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiFilter = () => {
    setAiMatchedSpecialties([]);
    setAiError('');
  };

  const DoctorSection = ({ title, doctors, color }) => (
    <section style={styles.sectionCard}>
      <h3 style={{ ...styles.sectionTitle, color }}>
        <Building2 size={20} /> {title}
      </h3>

      {doctors.length === 0 ? (
        <p className="subtext">No doctors found for selected filters.</p>
      ) : (
        <div style={styles.doctorGrid}>
          {doctors.map((doctor) => (
            <article key={doctor.id} style={styles.doctorCard}>
              <div style={styles.badgeRow}>
                <span style={styles.specialtyBadge}>{doctor.specialty}</span>
                <span style={styles.feeBadge}>Parchi {doctor.fee === 0 ? 'Free' : `Rs ${doctor.fee}`}</span>
              </div>

              <h4 style={styles.doctorName}>{doctor.doctorName}</h4>
              <p style={styles.hospitalName}>{doctor.hospitalName}</p>

              <div style={styles.metaLine}>
                <MapPin size={15} /> {doctor.area}, {doctor.city}
              </div>
              <div style={styles.metaLine}>
                <CalendarClock size={15} /> {doctor.days}
              </div>
              <div style={styles.metaLine}>
                <Clock3 size={15} /> {doctor.time}
              </div>

              <div style={styles.cardActions}>
                <button type="button" style={styles.secondaryBtn} onClick={() => setSelectedDoctor(doctor)}>
                  <UserRound size={16} /> View Profile
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.primaryBtn,
                    ...(bookedDoctorIds.has(doctor.id) ? styles.bookedBtn : {}),
                  }}
                  onClick={() => openParchiDialog(doctor)}
                  disabled={bookedDoctorIds.has(doctor.id)}
                >
                  {bookedDoctorIds.has(doctor.id) ? (
                    <>
                      <CheckCircle2 size={16} /> Parchi Purchased
                    </>
                  ) : (
                    <>
                      <Ticket size={16} /> Buy Parchi
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <h1 className="h2" style={{ color: 'var(--text-dark)' }}>Digital Doctor</h1>
        <p className="subtext">
          Find nearby government and private doctors, check their day/time availability, view full profiles, and buy parchi to skip long queues.
        </p>
      </header>

      <section style={styles.aiCard}>
        <h3 style={styles.aiTitle}><Brain size={20} /> AI Symptom to Doctor Match</h3>
        <p className="subtext" style={{ marginBottom: '10px' }}>
          Explain your disease/symptoms, and AI will filter suitable doctor specialties automatically.
        </p>
        <textarea
          style={styles.textArea}
          rows={4}
          placeholder="Example: Irregular periods, lower abdominal pain, stress and sleep issues"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        <div style={styles.aiActions}>
          <button type="button" className="btn btn-primary" onClick={findSpecialistsWithAI} disabled={aiLoading}>
            <ShieldPlus size={16} /> {aiLoading ? 'Finding Specialists...' : 'Find Suitable Doctors'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={clearAiFilter}>
            Clear AI Filter
          </button>
        </div>

        {aiMatchedSpecialties.length > 0 && (
          <p style={styles.filterNote}>
            Active AI filter: <strong>{aiMatchedSpecialties.join(', ')}</strong>
          </p>
        )}
        {aiError && <p style={styles.errorText}>{aiError}</p>}
      </section>

      <section style={styles.filtersCard}>
        <div style={styles.filterItem}>
          <label style={styles.label}>Location</label>
          <select style={styles.input} value={city} onChange={(e) => setCity(e.target.value)}>
            {cityOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>Search doctor/hospital/specialty</label>
          <div style={styles.searchWrap}>
            <Search size={16} color="var(--text-muted)" />
            <input
              style={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by gynecologist, therapist, hospital name..."
            />
          </div>
        </div>
      </section>

      <DoctorSection title="Government Hospitals" doctors={govtDoctors} color="#2b6cb0" />
      <DoctorSection title="Private Hospitals" doctors={privateDoctors} color="#8b5cf6" />

      {bookings.length > 0 && (
        <section style={styles.bookingCard}>
          <h3 style={styles.sectionTitle}><Ticket size={20} /> My Parchi Bookings</h3>
          <div style={styles.bookingList}>
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} style={styles.bookingItem}>
                <div>
                  <strong>{booking.doctorName}</strong>
                  <p className="subtext">{booking.specialty} • {booking.hospitalName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.tokenText}>{booking.token}</p>
                  <p className="subtext">Rs {booking.amountPaid}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDoctor && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedDoctor(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedDoctor.doctorName}</h3>
                <p className="subtext" style={{ marginTop: '4px' }}>{selectedDoctor.specialty} • {selectedDoctor.experienceYears} yrs exp</p>
              </div>
              <button type="button" onClick={() => setSelectedDoctor(null)} style={styles.closeBtn}>Close</button>
            </div>

            <div style={styles.profileGrid}>
              <p><strong>Hospital:</strong> {selectedDoctor.hospitalName}</p>
              <p><strong>Type:</strong> {selectedDoctor.hospitalType === 'govt' ? 'Government' : 'Private'}</p>
              <p><strong>Address:</strong> {selectedDoctor.address}</p>
              <p><strong>Available:</strong> {selectedDoctor.days}</p>
              <p><strong>Time:</strong> {selectedDoctor.time}</p>
              <p><strong>Languages:</strong> {selectedDoctor.languages}</p>
              <p><strong>Education:</strong> {selectedDoctor.education}</p>
              <p><strong>Parchi Fee:</strong> Rs {selectedDoctor.fee}</p>
            </div>

            <div style={styles.aboutBox}>
              <h4 style={{ marginBottom: '8px' }}>Doctor Profile</h4>
              <p style={{ margin: 0 }}>{selectedDoctor.about}</p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openParchiDialog(selectedDoctor, true)}
              disabled={bookedDoctorIds.has(selectedDoctor.id)}
              style={{ marginTop: '16px' }}
            >
              {bookedDoctorIds.has(selectedDoctor.id) ? 'Parchi Already Purchased' : 'Buy Parchi From Profile'}
            </button>
          </div>
        </div>
      )}

      {paymentDoctor && (
        <div style={styles.modalBackdrop} onClick={() => setPaymentDoctor(null)}>
          <div style={styles.paymentModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>Parchi Payment</h3>
                <p className="subtext" style={{ marginTop: '4px' }}>
                  {paymentDoctor.doctorName} • {paymentDoctor.specialty}
                </p>
              </div>
              <button type="button" onClick={() => setPaymentDoctor(null)} style={styles.closeBtn}>Close</button>
            </div>

            <div style={styles.paymentSummaryBox}>
              <p style={{ margin: 0 }}><strong>Hospital:</strong> {paymentDoctor.hospitalName}</p>
              <p style={{ margin: '4px 0 0' }}><strong>Consultation Time:</strong> {paymentDoctor.days} • {paymentDoctor.time}</p>
              <p style={{ margin: '4px 0 0' }}><strong>Total Amount:</strong> Rs {paymentDoctor.fee}</p>
            </div>

            <div style={styles.formGrid}>
              <label style={styles.formField}>
                Full Name
                <input
                  style={styles.formInput}
                  value={paymentForm.fullName}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </label>

              <label style={styles.formField}>
                Age
                <input
                  type="number"
                  min="10"
                  max="100"
                  style={styles.formInput}
                  value={paymentForm.age}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                />
              </label>

              <label style={styles.formField}>
                Phone Number
                <input
                  style={styles.formInput}
                  value={paymentForm.phone}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="10-digit number"
                />
              </label>

              <label style={styles.formField}>
                Payment Method
                <select
                  style={styles.formInput}
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash at Counter</option>
                </select>
              </label>

              {paymentForm.paymentMethod === 'UPI' && (
                <label style={{ ...styles.formField, gridColumn: '1 / -1' }}>
                  UPI ID
                  <input
                    style={styles.formInput}
                    value={paymentForm.upiId}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, upiId: e.target.value }))}
                    placeholder="example@upi"
                  />
                </label>
              )}

              {paymentForm.paymentMethod === 'Card' && (
                <label style={{ ...styles.formField, gridColumn: '1 / -1' }}>
                  Card Last 4 Digits
                  <input
                    style={styles.formInput}
                    maxLength={4}
                    value={paymentForm.cardLast4}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, cardLast4: e.target.value.replace(/\D/g, '') }))}
                    placeholder="1234"
                  />
                </label>
              )}
            </div>

            {paymentError && <p style={styles.errorText}>{paymentError}</p>}

            <div style={styles.paymentActions}>
              <button type="button" className="btn btn-secondary" onClick={() => setPaymentDoctor(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmParchiPayment}>
                Confirm Pay & Buy Parchi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 'none',
    margin: '0 auto',
  },
  header: {
    marginBottom: '22px',
  },
  aiCard: {
    backgroundColor: '#f4f7ff',
    border: '1px solid #d8e1ff',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    marginBottom: '18px',
  },
  aiTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    color: '#1e3a8a',
  },
  textArea: {
    width: '100%',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    padding: '10px 12px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    resize: 'vertical',
    outline: 'none',
  },
  aiActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  filterNote: {
    marginTop: '10px',
    color: 'var(--primary-dark)',
    fontSize: '0.95rem',
  },
  errorText: {
    marginTop: '10px',
    color: 'var(--danger)',
    fontSize: '0.92rem',
  },
  filtersCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px',
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: '12px',
    marginBottom: '18px',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  input: {
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    padding: '10px',
    fontFamily: 'inherit',
    backgroundColor: 'var(--bg-color)',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-color)',
    padding: '0 10px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    padding: '10px 0',
    outline: 'none',
  },
  sectionCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    marginBottom: '16px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  doctorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px',
  },
  doctorCard: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    backgroundColor: 'var(--bg-color)',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  specialtyBadge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  feeBadge: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  doctorName: {
    marginBottom: '2px',
    color: 'var(--text-dark)',
  },
  hospitalName: {
    marginBottom: '8px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  metaLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.86rem',
    color: 'var(--text-dark)',
    marginBottom: '5px',
  },
  cardActions: {
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    border: 'none',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary)',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
  },
  secondaryBtn: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-dark)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
  },
  bookedBtn: {
    backgroundColor: 'var(--success)',
    cursor: 'not-allowed',
  },
  bookingCard: {
    backgroundColor: '#f0fff4',
    border: '1px solid #c6f6d5',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    marginBottom: '20px',
  },
  bookingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bookingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
  },
  tokenText: {
    fontWeight: 700,
    color: '#2f855a',
    margin: 0,
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: '20px',
  },
  modalCard: {
    width: 'min(760px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    padding: '18px',
  },
  paymentModalCard: {
    width: 'min(720px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    padding: '18px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  closeBtn: {
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 10px',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  paymentSummaryBox: {
    border: '1px solid #dbeafe',
    backgroundColor: '#eff6ff',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    marginBottom: '12px',
    fontSize: '0.92rem',
    color: 'var(--text-dark)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  formInput: {
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    padding: '10px',
    backgroundColor: 'var(--bg-color)',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
  },
  paymentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '8px',
    fontSize: '0.92rem',
    color: 'var(--text-dark)',
  },
  aboutBox: {
    marginTop: '12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: '#f8fafc',
    padding: '12px',
  },
};

export default DigitalDoctor;
