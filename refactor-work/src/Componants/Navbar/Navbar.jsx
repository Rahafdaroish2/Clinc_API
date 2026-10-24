
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const translations = {
  en: {
    brandName: 'CareAmor',
    nav: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Team', path: '/team' },
      { name: 'Services', path: '/services' },
    ],
    login: 'Login',
    register: 'Register',
    themeLight: 'Light',
    themeDark: 'Dark',
    langButton: 'EN',
  },
  ar: {
    brandName: 'رعاية بحب',
    nav: [
      { name: 'الرئيسية', path: '/' },
      { name: 'من نحن', path: '/about' },
      { name: 'الفريق', path: '/team' },
      { name: 'الخدمات', path: '/services' },
    ],
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    themeLight: 'نهار',
    themeDark: 'ليل',
    langButton: 'ع',
  },
};

export default function Navbar() {
 
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('app_lang') || 'en'; } catch { return 'en'; }
  });
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('app_theme') === 'dark'; } catch { return false; }
  });


  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('app_lang', lang);
    } catch (err) {
      console.warn("LocalStorage error:", err);
   }
  }, [lang]);

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark-theme');
      else document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('app_theme', dark ? 'dark' : 'light');
    } catch (err) {
      console.warn("LocalStorage error:", err);
   }
  }, [dark]);

  
  useEffect(() => {
    function handleDocClick(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [open]);

 
  useEffect(() => {
    function onResize() { if (window.innerWidth > 880 && open) setOpen(false); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  const t = translations[lang];

  return (
    <header className="navbar" aria-label="Main navigation">
      <div className="nav-left">
        <div className="brand-logo">
          <img src="/public/Gemini_Generated_Image_bnvjo2bnvjo2bnvj-removebg-preview.png" alt="logo" className="logo" />
          <span className="brand-name-logo">{t.brandName}</span>
        </div>
      </div>

      <nav className="nav-center">
        <ul className="nav-links">
          {t.nav.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-right">
        <div className="toggles desktop-only">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label="Toggle language" className="lang-toggle">
            {t.langButton}
          </button>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="theme-toggle">
            {dark ? t.themeDark : t.themeLight}
          </button>
        </div>

        <div className="auth-buttons desktop-only">
          <Link to="/login" className="btn btn-login">{t.login}</Link>
          <Link to="/register" className="btn btn-register">{t.register}</Link>
        </div>

        <div className="mobile-controls" ref={panelRef}>
          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>

          <div className={`mobile-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile menu">
            <div className="mobile-panel-inner">
              <div className="mobile-top">
                <div className="brand-small">
                  <img src="/public/Gemini_Generated_Image_bnvjo2bnvjo2bnvj-removebg-preview.png" alt="" className="logo-small" />
                  <strong>{t.brandName}</strong>
                </div>

                <div className="mobile-actions">
                  <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{t.langButton}</button>
                  <button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? t.themeDark : t.themeLight}</button>
                </div>
              </div>

              <ul className="mobile-links">
                {t.nav.map((item, idx) => (
                  <li key={idx} onClick={() => setOpen(false)}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>

              <div className="mobile-auth">
                <Link to="/login" className="btn btn-login" onClick={() => setOpen(false)}>{t.login}</Link>
                <Link to="/register" className="btn btn-register" onClick={() => setOpen(false)}>{t.register}</Link>
              </div>
            </div>
          </div>

          <div className={`mobile-backdrop ${open ? 'show' : ''}`} onClick={() => setOpen(false)} aria-hidden />
        </div>
      </div>
    </header>
  );
}
