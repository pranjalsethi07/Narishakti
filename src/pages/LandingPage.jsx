import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/languageContextValue';
import { Mic, MessageCircle, Phone, ShoppingBag, ShieldCheck, HeartPulse, GraduationCap, ArrowRight, Quote } from 'lucide-react';

// three.js is only downloaded for the landing page
const LotusScene = lazy(() => import('../components/LotusScene'));

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, setLang } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(localStorage.getItem('appLang') || 'en');
  const [notes, setNotes] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    if (name && age && preferredLanguage) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userAge', age);
      localStorage.setItem('userNotes', notes);
      setLang(preferredLanguage);
      localStorage.setItem('appLang', preferredLanguage);
      navigate('/dashboard');
    }
  };

  const products = [
    { name: "Organic Sanitary Pads", price: "₹299", image: "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=800", link: "https://www.amazon.in/s?k=organic+sanitary+pads" },
    { name: "Women's Immunity Multivitamin", price: "₹450", image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800", link: "https://www.amazon.in/s?k=womens+multivitamin" },
    { name: "Reusable Menstrual Cup", price: "₹350", image: "https://images.pexels.com/photos/4046974/pexels-photo-4046974.jpeg?auto=compress&cs=tinysrgb&w=800", link: "https://www.amazon.in/s?k=menstrual+cup" },
    { name: "Iron & Folic Acid Supplements", price: "₹200", image: "https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=800", link: "https://www.amazon.in/s?k=iron+and+folic+acid+tablets+for+women" }
  ];

  return (
    <div style={styles.page} className="landing-theme">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent} className="fade-in">
          <div style={styles.heroText}>
            <h1 className="h1" style={styles.heroTitle}>Apni Digital Didi</h1>
            <p style={styles.heroSubtitle}>{t('landingSubtitle')}</p>
            <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '46ch'}}>
              Experience a private, judgment-free space designed for the modern Indian woman.
            </p>
            <div style={styles.lotusStage}>
              <Suspense fallback={null}>
                <LotusScene />
              </Suspense>
            </div>
          </div>

          <form onSubmit={handleContinue} style={styles.formCard} className="hover-card pop-in">
            <h2 className="h2" style={{ marginBottom: '24px', fontSize: '1.5rem', color: 'var(--text-dark)' }}>{t('getStarted')}</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('yourName')}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input} 
                placeholder="Ex: Priya"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('yourAge')}</label>
              <select 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                style={styles.input}
                required
              >
                <option value="" disabled>Select Age</option>
                <option value="10-14">10 - 14</option>
                <option value="15-22">15 - 22</option>
                <option value="23-35">23 - 35</option>
                <option value="35+">35+</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                style={styles.input}
                required
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
                placeholder="Any notes you'd like to save"
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', fontSize: '1.1rem', padding: '14px' }}>
              {t('continueBtn')}
            </button>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px'}}>
              <ShieldCheck size={16} color="var(--success)" />
              <p style={styles.privacyText}>{t('privacyProtected')}</p>
            </div>
          </form>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" style={styles.aboutSection}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center'}}>
          <div style={styles.aboutImageContainer} className="fade-in">
            <img src="https://images.unsplash.com/photo-1623091410901-00e2d268901f?auto=format&fit=crop&q=80&w=400" alt="Smiling Indian Woman" style={styles.aboutImage1} />
            <img src="https://images.unsplash.com/photo-1542848419-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="Confident Women" style={styles.aboutImage2} />
            <div style={styles.floatingBadge}>
               <HeartPulse size={24} color="#e53e3e" /> 
               <span style={{fontWeight: 'bold', marginLeft: '8px'}}>Empowering 100k+ Women</span>
            </div>
          </div>
          <div style={styles.aboutText} className="fade-in">
            <h2 className="h2" style={{color: 'var(--primary-dark)', marginBottom: '24px'}}>{t('whoWeAre')}</h2>
            <p style={styles.paragraph}>{t('aboutDesc1')}</p>
            <p style={styles.paragraph}>{t('aboutDesc2')}</p>
            
            <div style={{display: 'flex', gap: '16px', marginTop: '32px'}}>
              <div style={styles.featureBox}>
                <div style={styles.featureIcon}><Mic size={24} color="var(--primary)" /></div>
                <h4>Voice First AI</h4>
              </div>
              <div style={styles.featureBox}>
                <div style={styles.featureIcon}><GraduationCap size={24} color="var(--secondary)" /></div>
                <h4>Financial Literacy</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACTS SECTION */}
      <section style={styles.factsSection}>
        <div style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'center'}} className="fade-in">
          <h2 className="h2" style={{color: '#fff', marginBottom: '40px'}}>{t('factsTitle')}</h2>
          <div style={styles.factsGrid}>
            <div style={styles.factCard}>
              <h1 style={{fontSize: '3rem', color: '#fff', marginBottom: '16px'}}>18%</h1>
              <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem'}}>{t('fact1')}</p>
            </div>
            <div style={styles.factCard}>
              <h1 style={{fontSize: '3rem', color: '#fff', marginBottom: '16px'}}>70%</h1>
              <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem'}}>{t('fact2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP SECTION */}
      <section id="shop" style={styles.shopSection}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}} className="fade-in">
          <div style={{textAlign: 'center', marginBottom: '48px'}}>
            <h2 className="h2" style={{color: 'var(--primary-dark)', marginBottom: '8px'}}>{t('shopTitle')}</h2>
            <p className="subtext" style={{fontSize: '1.1rem'}}>{t('shopSub')}</p>
          </div>

          <div style={styles.productGrid}>
            {products.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noreferrer" style={styles.productCard} className="hover-card">
                <img src={p.image} alt={p.name} style={styles.productImage} />
                <div style={styles.productInfo}>
                  <h4 style={{fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-dark)'}}>{p.name}</h4>
                  <p style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem'}}>{p.price}</p>
                  <div style={styles.buyBtn}>
                    Buy on Amazon <ArrowRight size={16} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="stories" style={styles.testimonialsSection}>
        <div style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'center'}} className="fade-in">
          <h2 className="h2" style={{color: 'var(--primary-dark)', marginBottom: '48px'}}>{t('testimonialsTitle')}</h2>
          
          <div style={styles.testimonialGrid}>
            <div style={styles.testimonialCard}>
              <Quote size={40} color="var(--primary-light)" style={{marginBottom: '16px'}} />
              <p style={{fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6}}>{t('test1')}</p>
              <h4 style={{color: 'var(--primary-dark)'}}>{t('test1Author')}</h4>
            </div>
            <div style={styles.testimonialCard}>
              <Quote size={40} color="var(--primary-light)" style={{marginBottom: '16px'}} />
              <p style={{fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6}}>{t('test2')}</p>
              <h4 style={{color: 'var(--primary)'}}>{t('test2Author')}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* FIXED FOOTER */}
      <footer style={styles.footer}>
        <button style={styles.footerBtn} className="mic-pulse">
          <div style={{...styles.iconCircle, background: 'var(--primary)'}}>
            <Mic color="#fff" />
          </div>
          <span>{t('askQue')}</span>
        </button>
        
        <button style={styles.footerBtn}>
          <div style={{...styles.iconCircle, background: '#25D366'}}>
            <MessageCircle color="#fff" />
          </div>
          <span>{t('chatWa')}</span>
        </button>
        
        <button style={styles.footerBtn}>
          <div style={{...styles.iconCircle, background: 'var(--secondary)'}}>
            <Phone color="#fff" />
          </div>
          <span>{t('callUs')}</span>
        </button>
        
        <a href="#shop" style={{...styles.footerBtn, textDecoration: 'none'}}>
          <div style={{...styles.iconCircle, background: 'var(--accent)'}}>
            <ShoppingBag color="#fff" />
          </div>
          <span>{t('buyProd')}</span>
        </a>
      </footer>
    </div>
  );
};

const styles = {
  page: { backgroundColor: 'var(--bg-color)', paddingBottom: '100px' }, // space for fixed footer
  
  heroSection: { minHeight: '90vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary-light)', backgroundImage: 'radial-gradient(circle at 18% 70%, rgba(242,177,52,0.18) 0%, transparent 42%), radial-gradient(circle at 85% 15%, rgba(229,96,138,0.18) 0%, transparent 50%)', padding: '40px 24px' },
  heroContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px', width: '100%' },
  heroText: { flex: '1 1 400px' },
  heroTitle: { fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', color: 'var(--primary-dark)', marginBottom: '12px', lineHeight: 1.05 },
  heroSubtitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)', color: 'var(--primary)', marginBottom: '16px', lineHeight: 1.35 },
  lotusStage: { width: '100%', maxWidth: '460px', height: 'clamp(240px, 36vh, 360px)', marginTop: '24px', marginLeft: '-12px' },
  formCard: { flex: '1 1 400px', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', maxWidth: '500px', border: '1px solid rgba(255,143,171,0.3)' },
  
  aboutSection: { padding: '80px 24px', backgroundColor: 'var(--surface)' },
  aboutImageContainer: { flex: '1 1 400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', position: 'relative' },
  aboutImage1: { width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', transform: 'translateY(32px)' },
  aboutImage2: { width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' },
  floatingBadge: { position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: 'var(--surface)', padding: '12px 20px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', zIndex: 10 },
  aboutText: { flex: '1 1 500px' },
  paragraph: { fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '16px' },
  featureBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: 'var(--radius-md)', flex: 1 },
  featureIcon: { width: '48px', height: '48px', backgroundColor: 'var(--surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' },
  
  factsSection: { padding: '80px 24px', backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' },
  factsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
  factCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' },

  shopSection: { padding: '80px 24px', backgroundColor: 'var(--bg-color)' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' },
  productCard: { backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' },
  productImage: { width: '100%', height: '200px', objectFit: 'cover' },
  productInfo: { padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 },
  buyBtn: { marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#c14717', fontWeight: '600', fontSize: '0.9rem' }, // Amazon orange-ish

  testimonialsSection: { padding: '80px 24px', backgroundColor: 'var(--surface)' },
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' },
  testimonialCard: { backgroundColor: 'var(--bg-color)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', textAlign: 'left' },

  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)' },
  input: { width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'var(--bg-color)' },
  textarea: { width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'var(--bg-color)', resize: 'vertical', minHeight: '96px' },
  privacyText: { textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' },
  
  footer: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--surface)', padding: '10px 16px', display: 'flex', justifyContent: 'space-around', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', zIndex: 100, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' },
  footerBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-dark)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none' },
  iconCircle: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }
};

export default LandingPage;
