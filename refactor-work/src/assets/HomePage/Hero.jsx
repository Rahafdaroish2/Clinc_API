import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import './Hero.css';


const translations = {
  en: {
    title: 'Your care starts here',
    subtitle: 'High-quality care, modern equipment and friendly staff. Book your appointment.',
    cta: 'Book Now',
    cards: {
      contact: { title: 'Contact Us', lines: ['Phone: +1 234 567 890', 'Email: contact@clinic.example', 'Address: 123 Health St.'] },
      hours: { title: 'Working Hours', lines: ['Mon - Fri: 8:00 - 18:00', 'Sat: 9:00 - 14:00', 'Sun: Closed'] },
      payments: { title: 'Payments & Insurance', lines: ['Cash, Card, Online', 'Accepted: HealthCarePlus, MediTrust'] },
      urgent: { title: 'Urgent Services', lines: ['24/7 Triage', 'ER Coordination', 'On-call Doctors'] },
      doctors: { title: 'Doctors', lines: ['Total: 12 doctors', 'Specialists: Cardiology, Pediatrics, GP'] },
      experience: { title: 'Experience', lines: ['Average experience: 10 years', 'Established: 2011'] },
      languages: { title: 'Languages', lines: ['Arabic, English, French'] },
    }
  },
  ar: {
    title: 'رعايتك تبدأ من هنا',
    subtitle: 'رعاية عالية الجودة، معدات حديثة وفريق ودود. احجز موعدك الآن.',
    cta: 'احجز الآن',
    cards: {
      contact: { title: 'تواصل معنا', lines: ['هاتف: +1 234 567 890', 'ايميل: contact@clinic.example', 'العنوان: شارع الصحة 123'] },
      hours: { title: 'أوقات العمل', lines: ['الاثنين - الجمعة: 8:00 - 18:00', 'السبت: 9:00 - 14:00', 'الأحد: مغلق'] },
      payments: { title: 'الدفع والتأمينات', lines: ['نقدًا، بطاقة، دفع إلكتروني', 'مقبول: HealthCarePlus, MediTrust'] },
      urgent: { title: 'الخدمات الفورية', lines: ['ترياج 24/7', 'تنسيق الطوارئ', 'أطباء المناوبة'] },
      doctors: { title: 'عدد الأطباء', lines: ['إجمالي: 12 طبيب', 'أخصائيون: قلب، أطفال، عام'] },
      experience: { title: 'الخبرة', lines: ['متوسط الخبرة: 10 سنوات', 'تأسست: 2011'] },
      languages: { title: 'اللغات', lines: ['العربية، الإنجليزية، الفرنسية'] },
    }
  }
};

export default function Hero() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || document.documentElement.lang || 'en');
  const [dark, setDark] = useState(() => localStorage.getItem('app_theme') === 'dark' || document.documentElement.classList.contains('dark-theme'));

 
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const currentLang = document.documentElement.lang || 'en';
      if (currentLang !== lang) setLang(currentLang);
      const isDark = document.documentElement.classList.contains('dark-theme');
      if (isDark !== dark) setDark(isDark);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    return () => obs.disconnect();
  }, [lang, dark]);

  const t = translations[lang] || translations.en;

  return (
    <section className="hero-section" aria-labelledby="hero-title">
     
      <video className="hero-video" autoPlay muted loop playsInline poster="/hero-poster.jpg">
        <source src="/src/image/HnVideoEditor_2025_11_01_183449400.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      
      <div className="hero-content">
        <div className="hero-left">
          <h1 id="hero-title" className="hero-title">{t.title}</h1>
          <p className="hero-sub">{t.subtitle}</p>

          
          <Link to="/booking" className="hero-cta">{t.cta}</Link>
        </div>
      </div>

     
      <div className="hero-cards" role="region" aria-label={lang === 'ar' ? 'معلومات' : 'Information'}>
        <div className="cards-inner">
          <Card data={t.cards.contact} />
          <Card data={t.cards.hours} />
          <Card data={t.cards.payments} />
          <Card data={t.cards.urgent} />
          <Card data={t.cards.doctors} />
          <Card data={t.cards.experience} />
          <Card data={t.cards.languages} />
        </div>
      </div>
    </section>
  );
}


function Card({ data }) {
  return (
    <div className="info-card" tabIndex="0" role="article" aria-label={data.title}>
      <h4 className="card-title">{data.title}</h4>
      <ul className="card-lines">
        {data.lines.map((ln, i) => <li key={i} className="card-line">{ln}</li>)}
      </ul>
    </div>
  );
}
