import { readStoredValue } from '../../utils/storage';
import { useEffect, useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const translations = {
  en: {
    aboutTitle: 'About Us',
    aboutText: 'We provide compassionate care with expert staff and modern facilities.',
    linksTitle: 'Quick Links',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Team', to: '/team' },
      { label: 'Services', to: '/services' },
      { label: 'Booking', to: '/booking' },
    ],
    contactTitle: 'Contact',
    address: '123 Health St., Damascus',
    phone: '+963-9xxxxxxx',
    email: 'contact@clinic.example',
    newsletterPlaceholder: 'Your email',
    newsletterBtn: 'Subscribe',
    langBtn: 'ع/EN',
    darkBtnLight: 'Light',
    darkBtnDark: 'Dark',
    copy: 'All rights reserved.',
  },
  ar: {
    aboutTitle: 'من نحن',
    aboutText: 'نقدّم رعاية رحيمة بفريق مختص ومرافق حديثة.',
    linksTitle: 'روابط سريعة',
    links: [
      { label: 'الرئيسية', to: '/' },
      { label: 'من نحن', to: '/about' },
      { label: 'الفريق', to: '/team' },
      { label: 'الخدمات', to: '/services' },
      { label: 'الحجز', to: '/booking' },
    ],
    contactTitle: 'تواصل معنا',
    address: 'شارع الصحة 123، دمشق',
    phone: '+963-9xxxxxxx',
    email: 'contact@clinic.example',
    newsletterPlaceholder: 'بريدك الإلكتروني',
    newsletterBtn: 'اشتراك',
    langBtn: 'EN/ع',
    darkBtnLight: 'نهار',
    darkBtnDark: 'ليل',
    copy: 'جميع الحقوق محفوظة.',
  },
};

export default function Footer() {

  const [lang, setLang] = useState(() => readStoredValue('app_lang', document.documentElement.lang || 'en'));
  const [dark, setDark] = useState(() => readStoredValue('app_theme', '') === 'dark' || document.documentElement.classList.contains('dark-theme'));
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';

  useEffect(() => {
    const obs = new MutationObserver(() => {
      const currentLang = document.documentElement.lang || 'en';
      if (currentLang !== lang) setLang(currentLang);
      const isDarkNow = document.documentElement.classList.contains('dark-theme');
      if (isDarkNow !== dark) setDark(isDarkNow);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    return () => obs.disconnect();
  }, [lang, dark]);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      localStorage.setItem('app_lang', lang);
    } catch (err) {
      console.warn("LocalStorage error:", err);
   }

  }, [lang, isRTL]);

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark-theme');
      else document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('app_theme', dark ? 'dark' : 'light');
    } catch (err) {
      console.warn("LocalStorage error:", err);
    }

  }, [dark]);


  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setEmail(''), 600);
  };


  return (
    <footer className="site-footer" dir={isRTL ? 'rtl' : 'ltr'} aria-label={lang === 'ar' ? 'تذييل الصفحة' : 'Footer'}>
      <div className="footer-inner">
        <div className="footer-col footer-about">
          <h4>{t.aboutTitle}</h4>
          <p>{t.aboutText}</p>

        </div>

        <nav className="footer-col footer-links" aria-label={t.linksTitle}>
          <h4>{t.linksTitle}</h4>
          <ul>
            {t.links.map((ln, i) => (
              <li key={i}><Link to={ln.to}>{ln.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="footer-col footer-contact">
          <h4>{t.contactTitle}</h4>
          <address>
            <div className="fc-row"><svg viewBox="0 0 24 24" className="icon"><path d="M12 2C8 2 5 5 5 9c0 7 7 13 7 13s7-6 7-13c0-4-3-7-7-7zM12 11.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg><span>{t.address}</span></div>
            <div className="fc-row"><svg viewBox="0 0 24 24" className="icon"><path d="M6.62 10.79a15.054 15.054 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.72 11.72 0 0 0 3.64.58 1 1 0 0 1 1 1v3.61a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.61a1 1 0 0 1 1 1c0 1.25.2 2.47.58 3.64a1 1 0 0 1-.24 1.01l-2.33 2.14z" /></svg><a href={`tel:${t.phone}`}>{t.phone}</a></div>
            <div className="fc-row"><svg viewBox="0 0 24 24" className="icon"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" /></svg><a href={`mailto:${t.email}`}>{t.email}</a></div>
          </address>

          <form className="newsletter" onSubmit={onSubscribe}>
            <label htmlFor="femail" className="sr-only">newsletter</label>
            <input id="femail" type="email" placeholder={t.newsletterPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
            <button type="submit" className="btn-sub">{t.newsletterBtn}</button>
          </form>

          {subscribed && <div className="subs-note" role="status">{lang === 'ar' ? 'شكرًا! تم الاشتراك.' : 'Thanks — you are subscribed.'}</div>}

          <div className="socials" aria-hidden>
            <a href="#" className="social" aria-label="facebook" title="facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H8.1v-2.9h2.34V9.41c0-2.31 1.37-3.59 3.47-3.59.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.69h2.5l-.4 2.9h-2.1v7.03C18.34 21.2 22 17.06 22 12.07z"/></svg>
            </a>
            <a href="#" className="social" aria-label="twitter" title="twitter">
              <svg viewBox="0 0 24 24"><path d="M22 5.92c-.6.26-1.25.44-1.93.52.7-.42 1.23-1.08 1.48-1.86-.66.39-1.4.68-2.18.84A3.4 3.4 0 0 0 16.15 4c-1.88 0-3.4 1.52-3.4 3.4 0 .27.03.54.09.79-2.83-.14-5.34-1.5-7.02-3.57-.29.5-.45 1.08-.45 1.7 0 1.18.6 2.22 1.52 2.83-.56-.02-1.09-.17-1.55-.43v.04c0 1.64 1.16 3.01 2.7 3.32-.28.08-.58.12-.88.12-.22 0-.44-.02-.65-.06.44 1.37 1.72 2.37 3.23 2.4A6.83 6.83 0 0 1 2 19.54a9.63 9.63 0 0 0 5.22 1.53c6.27 0 9.7-5.19 9.7-9.69v-.44c.67-.48 1.24-1.08 1.7-1.77-.61.27-1.26.46-1.94.54.7-.42 1.23-1.08 1.48-1.86z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} Clinic — {t.copy}</small>
      </div>
    </footer>
  );
}
