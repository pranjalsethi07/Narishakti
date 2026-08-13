import React, { useMemo, useState } from 'react';
import { Briefcase, Building2, ExternalLink, GraduationCap, Landmark, ShieldCheck } from 'lucide-react';

const PRIVATE_JOBS = [
  {
    id: 'pvt-1',
    title: 'Customer Success Associate (Women Preferred)',
    company: 'TechNova Services',
    location: 'Remote / Bengaluru',
    eligibility: ['Graduate in any stream', 'Basic spoken English/Hindi', '0-2 years experience'],
    requirements: ['Laptop + stable internet', 'Communication skills', 'Willingness to work in shifts'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Women%20Customer%20Success%20India',
  },
  {
    id: 'pvt-2',
    title: 'Women Safety Program Coordinator',
    company: 'UrbanSafe Foundation',
    location: 'Delhi NCR',
    eligibility: ['Graduate or social work background', '1+ year NGO/community experience', 'Local language familiarity'],
    requirements: ['Field coordination', 'Report writing', 'Stakeholder communication'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Women%20Program%20Coordinator%20India',
  },
  {
    id: 'pvt-3',
    title: 'Accounts and Operations Executive',
    company: 'FinBridge Pvt Ltd',
    location: 'Mumbai / Hybrid',
    eligibility: ['B.Com/BBA preferred', 'Excel basics', '0-3 years experience'],
    requirements: ['Invoice handling', 'Vendor follow-up', 'Basic bookkeeping knowledge'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Women%20Accounts%20Executive%20India',
  },
];

const PUBLIC_JOBS = [
  {
    id: 'gov-1',
    title: 'SSC Combined Graduate Level (CGL)',
    department: 'Staff Selection Commission',
    location: 'All India',
    eligibility: ['Bachelor degree from recognized university', 'Age as per SSC notification', 'Category-based relaxations apply'],
    requirements: ['Tier-I and Tier-II exams', 'Document verification', 'Medical standards (post-based)'],
    applyUrl: 'https://ssc.gov.in/',
  },
  {
    id: 'gov-2',
    title: 'RRB NTPC Recruitment',
    department: 'Indian Railways',
    location: 'Zones across India',
    eligibility: ['12th/Graduate (post-dependent)', 'Age criteria as per notice', 'Reservation benefits available'],
    requirements: ['CBT exam stages', 'Skill test (where applicable)', 'Medical fitness standards'],
    applyUrl: 'https://www.rrbcdg.gov.in/',
  },
  {
    id: 'gov-3',
    title: 'National Career Service Government Openings',
    department: 'Ministry of Labour & Employment',
    location: 'Pan India',
    eligibility: ['As per each listed post', 'Educational criteria varies', 'Age/experience post specific'],
    requirements: ['NCS profile registration', 'Application through listed employer portal', 'Interview/exam based selection'],
    applyUrl: 'https://www.ncs.gov.in/',
  },
];

const OpportunitiesWomen = () => {
  const [activeTab, setActiveTab] = useState('private');

  const jobs = useMemo(() => (activeTab === 'private' ? PRIVATE_JOBS : PUBLIC_JOBS), [activeTab]);

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <h1 className="h2" style={{ color: 'var(--text-dark)' }}>Opportunities for Women</h1>
        <p className="subtext">
          Explore private and public sector opportunities, check eligibility and requirements, then apply through trusted portals.
        </p>
      </header>

      <section style={styles.topTabs}>
        <button
          type="button"
          style={{ ...styles.tabBtn, ...(activeTab === 'private' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('private')}
        >
          <Briefcase size={17} /> Private Sector Jobs
        </button>
        <button
          type="button"
          style={{ ...styles.tabBtn, ...(activeTab === 'public' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('public')}
        >
          <Landmark size={17} /> Public Sector Jobs
        </button>
      </section>

      <div style={styles.grid}>
        {jobs.map((job) => (
          <article key={job.id} style={styles.card}>
            <div style={styles.cardHead}>
              <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{job.title}</h3>
              <span style={styles.sectorBadge}>{activeTab === 'private' ? 'Private' : 'Government'}</span>
            </div>

            <p style={styles.metaLine}>
              <Building2 size={15} />
              {activeTab === 'private' ? job.company : job.department}
            </p>
            <p style={styles.metaLine}>
              <GraduationCap size={15} />
              {job.location}
            </p>

            <div style={styles.infoBlock}>
              <h4 style={styles.blockTitle}>Eligibility Criteria</h4>
              <ul style={styles.list}>
                {job.eligibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.infoBlock}>
              <h4 style={styles.blockTitle}>Requirements</h4>
              <ul style={styles.list}>
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <a href={job.applyUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={styles.applyBtn}>
              <ExternalLink size={16} />
              {activeTab === 'private' ? 'View on LinkedIn' : 'Open Government Portal'}
            </a>
          </article>
        ))}
      </div>

      <div style={styles.noteCard}>
        <ShieldCheck size={18} color="var(--success)" />
        <p style={{ margin: 0 }}>
          Always verify latest age limits, reservation rules, and deadlines on the final application portal before applying.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1050px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  topTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-dark)',
    borderRadius: '9999px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  },
  tabBtnActive: {
    borderColor: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '14px',
  },
  card: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'flex-start',
  },
  sectorBadge: {
    borderRadius: '9999px',
    backgroundColor: '#e6fffa',
    border: '1px solid #99f6e4',
    color: '#115e59',
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  metaLine: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  infoBlock: {
    marginTop: '6px',
  },
  blockTitle: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--text-dark)',
  },
  list: {
    margin: '6px 0 0',
    paddingLeft: '18px',
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
  applyBtn: {
    marginTop: '8px',
    width: '100%',
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  noteCard: {
    marginTop: '16px',
    border: '1px solid #c6f6d5',
    backgroundColor: '#f0fff4',
    color: '#1f7a46',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
};

export default OpportunitiesWomen;
