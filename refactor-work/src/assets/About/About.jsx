

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const translations = {
  en: {
    pageTitle: 'About Us',
    storyText: 'We offer comprehensive medical care that combines expertise and cutting-edge technology in a comfortable and safe environment. We care for your physical and mental well-being to provide you with a truly exceptional and compassionate healthcare experience.Our mission is to provide high-quality medical services with a spirit of care and compassion.We place the patient at the heart of our attention every step of their health journey.We aspire to be a trusted destination for modern and humane healthcare in the region..',
    cardTitle: 'We are here for you',
    cardText: 'Friendly staff, experienced doctors, and immediate support when you need it.',
    bookNow: 'Book Now',

    whyTitle: 'Why Us?',
    whySubtitle: 'Why patients choose our clinic..!',
    iconsRow: [
      { icon: '✅', text: 'Fast Appointments' },
      { icon: '🩺', text: 'Expert Doctors' },
      { icon: '🏥', text: 'Modern Equipment' },
      { icon: '🤝', text: 'Patient-centered Care' }
    ],
    leftCards: [
      { icon: '🕊️', title: 'Trust' },
      { icon: '❤️', title: 'Humanity' },
      { icon: '👨‍⚕️', title: 'Professionalism' }
    ],
    rightCards: [
      { icon: '💡', title: 'Innovation' },
      { icon: '🔒', title: 'Privacy' },
      { icon: '🌿', title: 'Comfort' }
    ]
  },
  ar: {
    pageTitle: 'من نحن',
    storyText: 'نقدم رعاية طبية متكاملة تجمع بين الخبرة والتقنيات الحديثة في بيئة مريحة وآمنة.نهتم بصحتك الجسدية والنفسية لنمنحك تجربة علاجية إنسانية مميزةرسالتنا هيتوفير خدمات طبية عالية الجودة بروح من العناية والرحمة.نضع المريض في قلب اهتمامنا في كل خطوة من رحلته الصحية.نأمل أن نكون وجهة موثوقة للرعاية الصحية الحديثة والإنسانية في المنطقة',
    cardTitle: 'نحن هنا من أجلك',
    cardText: 'فريق ودود، أطباء ذوو خبرة، ودعم فوري عند حاجتك.',
    bookNow: 'احجز الآن',

    whyTitle: 'لماذا نحن؟',
    whySubtitle: 'لماذا يختار المرضى عيادتنا..!',
    iconsRow: [
      { icon: '✅', text: 'مواعيد سريعة' },
      { icon: '🩺', text: 'أطباء خبراء' },
      { icon: '🏥', text: 'معدات حديثة' },
      { icon: '🤝', text: 'رعاية تتمحور حول المريض' }
    ],
    leftCards: [
      { icon: '🕊️', title: 'الثقة' },
      { icon: '❤️', title: 'الإنسانية' },
      { icon: '👨‍⚕️', title: 'الاحتراف' }
    ],
    rightCards: [
      { icon: '💡', title: 'الابتكار' },
      { icon: '🔒', title: 'الخصوصية' },
      { icon: '🌿', title: 'الراحة' }
    ]
  }
};

export default function About() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('app_lang') || document.documentElement.lang || 'en'; }
    catch { return 'en'; }
  });

  useEffect(() => {
    const obs = new MutationObserver(() => {
      const newLang = document.documentElement.lang || 'en';
      if (newLang !== lang) setLang(newLang);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => obs.disconnect();
  }, [lang]);

  const t = translations[lang] || translations.en;

  return (
    <main className="about-page" aria-labelledby="about-heading">
      <div className="about-container">
        <section className="about-left">
          <h1 id="about-heading" className="about-title">{t.pageTitle}</h1>

          <article className="about-section">
            <p className="section-text">{t.storyText}</p>
          </article>

          <div className="about-card">
            <div className="card-left">
              <h3 className="card-title">{t.cardTitle}</h3>
              <p className="card-text">{t.cardText}</p>
            </div>
            <div className="card-right">
              <Link to="/booking" className="card-cta">{t.bookNow}</Link>
            </div>
          </div>
        </section>

        <aside className="about-right">
          <div className="about-images">
            <img src="/src/image/Why Smart Money Is Betting on Specialized Robots Over Humanoid Hype.jfif" alt={lang === 'ar' ? 'صورة العيادة' : 'clinic photo 1'} className="about-image img-top" />
            <img src="/src/image/The Healing Touch of a Nurse.jfif" alt={lang === 'ar' ? 'طاقمنا' : 'our staff'} className="about-image img-bottom" />
          </div>
        </aside>
      </div>
      <div>
        <section className="why-us" aria-labelledby="why-heading">
            <h2 id="why-heading" className="why-title">{t.whyTitle}</h2>
            <p className="why-sub">{t.whySubtitle}</p>

            <div className="why-layout">
              <div className="why-cards left-cards">
                {t.leftCards.map((c, i) => (
                  <div key={i} className="circle-card">
                    <div className="circle-icon">{c.icon}</div>
                    <div className="circle-text">{c.title}</div>
                  </div>
                ))}
              </div>

              <div className="why-center">
                <div className="why-image-wrap">
                  <img src="/src/image/download (30).jpg" alt={t.whyTitle} className="why-image" />
                </div>

                <div className="icons-row">
                  {t.iconsRow.map((it, idx) => (
                    <div className="icon-item" key={idx}>
                      <div className="icon-emoji">{it.icon}</div>
                      <div className="icon-text">{it.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="why-cards right-cards">
                {t.rightCards.map((c, i) => (
                  <div key={i} className="circle-card">
                    <div className="circle-icon">{c.icon}</div>
                    <div className="circle-text">{c.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      </div>
    </main>
  );
}
