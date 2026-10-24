import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import doctorsData from '/public/doctors.json'; 
import './Team.css';

const translations = {
  en: { pageTitle: 'Our Team' },
  ar: { pageTitle: 'فريقنا' },
};

export default function Team() {
  const [lang, setLang] = useState(document.documentElement.lang || 'en');
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark-theme'));
  const location = useLocation();
  const cardsRef = useRef({}); 

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentLang = document.documentElement.lang || 'en';
      if (currentLang !== lang) setLang(currentLang);
      const isDark = document.documentElement.classList.contains('dark-theme');
      if (isDark !== dark) setDark(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'class'],
    });

    return () => observer.disconnect();
  }, [lang, dark]);

  const t = translations[lang] || translations.en;

 
  useEffect(() => {
    const hash = location.hash; 
    if (hash) {
      const id = hash.replace('#', '');
      
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          el.classList.add('highlight');
          setTimeout(() => el.classList.remove('highlight'), 2500);
        }
      }, 120);
    }
  }, [location]);

  return (
    <main className={`team-page ${dark ? 'dark' : 'light'}`}>
      <h1 className="team-title">{t.pageTitle}</h1>
      <div className="team-cards">
        {doctorsData.map((doc) => (
          <div
            key={doc.id}
            id={`doc-${doc.id}`}            
            className="team-card"
            ref={el => { if (el) cardsRef.current[doc.id] = el; }}
          >
            <img src={doc.photo} alt={doc.name} className="team-img" />
            <div className="team-info">
              <h2 className="team-name">{doc.name}</h2>
              <p className="team-specialty">{doc.specialty}</p>
              <p className="team-location">{doc.location}</p>
              <p className="team-bio">{doc.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
