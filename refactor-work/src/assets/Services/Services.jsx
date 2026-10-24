
import { useEffect, useState } from "react";
import "./Services.css";

const translations = {
  en: {
    title: "Our Medical Services",
    subtitle:
      "Explore the main specialties we provide with expert doctors and modern equipment.",
    featuredTitle: "Featured Services",
    featuredSubtitle:
      "Exceptional medical experiences designed for your comfort and health.",
    services: [
      { icon: "/src/image/Gemini_Generated_Image_jqyrorjqyrorjqyr-removebg-preview.png", name: "Cardiology" },
      { icon: "/src/image/Gemini_Generated_Image_f2v4hff2v4hff2v4-removebg-preview.png", name: "Dermatology" },
      { icon: "/src/image/Gemini_Generated_Image_1ghv8a1ghv8a1ghv-removebg-preview.png", name: "Pediatrics" },
      { icon: "/src/image/Gemini_Generated_Image_vcczczvcczczvccz-removebg-preview.png", name: "Neurology" },
      { icon: "/src/image/Gemini_Generated_Image_7v6027v6027v6027-removebg-preview.png", name: "General Medicine" },
    ],
    featured: [
      { img: "/src/image/823e173b-7853-407a-a75a-6293429f937b.jfif", text: "Smart medical follow-up via app" },
      { img: "/src/image/sfigmomanonetro.jpg", text: "Home medical tests" },
      { img: "/src/image/Hard Work Pays Off  The Journey to Success _.jpg", text: "Emergency home visits" },
      { img: "/src/image/The Healing Touch of a Nurse.jfif", text: "Health awareness sessions" },
    ],
  },
  ar: {
    title: "خدماتنا الطبية",
    subtitle:
      "استكشف أبرز التخصصات التي نقدمها مع نخبة من الأطباء وأحدث المعدات.",
    featuredTitle: "خدمات مميزة",
    featuredSubtitle: "تجارب طبية استثنائية صُممت لراحتك وصحتك.",
    services: [
      { icon: "/src/image/Gemini_Generated_Image_jqyrorjqyrorjqyr-removebg-preview.png", name: "أمراض القلب" },
      { icon: "/src/image/Gemini_Generated_Image_f2v4hff2v4hff2v4-removebg-preview.png", name: "الأمراض الجلدية" },
      { icon: "/src/image/Gemini_Generated_Image_1ghv8a1ghv8a1ghv-removebg-preview.png", name: "طب الأطفال" },
      { icon: "/src/image/Gemini_Generated_Image_vcczczvcczczvccz-removebg-preview.png", name: "علم الأعصاب" },
      { icon: "/src/image/Gemini_Generated_Image_7v6027v6027v6027-removebg-preview.png", name: "الطب العام" },
    ],
    featured: [
      { img: "/src/image/823e173b-7853-407a-a75a-6293429f937b.jfif", text: "متابعة طبية ذكية عبر التطبيق" },
      { img: "/src/image/sfigmomanonetro.jpg", text: "اختبارات طبية منزلية" },
      { img: "/src/image/Hard Work Pays Off  The Journey to Success _.jpg", text: "زيارات منزلية للطوارئ" },
      { img: "/src/image/The Healing Touch of a Nurse.jfif", text: "جلسات توعية أو تثقيف للمرضى" },
    ],
  },
};

export default function Services() {
  
  const readLang = () => {
    try {
      if (typeof window === "undefined") return "en";
      return localStorage.getItem("app_lang") || document.documentElement.lang || "en";
    } catch {
      return document.documentElement.lang || "en";
    }
  };

  const readDark = () => {
    try {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("app_theme") === "dark" || document.documentElement.classList.contains("dark-theme");
    } catch {
      return document.documentElement.classList.contains("dark-theme");
    }
  };

  const [lang, setLang] = useState(readLang);
  const [dark, setDark] = useState(readDark);

  useEffect(() => {
    const obs = new MutationObserver(() => {
      const currentLang = document.documentElement.lang || "en";
      if (currentLang !== lang) setLang(currentLang);
      const isDark = document.documentElement.classList.contains("dark-theme");
      if (isDark !== dark) setDark(isDark);
    });

    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "class"] });
    return () => obs.disconnect();
  }, [lang, dark]); 

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      if (typeof window !== "undefined") localStorage.setItem("app_lang", lang);
    } catch (err) {
      console.warn("Storage error:", err);
   }

  }, [lang]);

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add("dark-theme");
      else document.documentElement.classList.remove("dark-theme");
      if (typeof window !== "undefined") localStorage.setItem("app_theme", dark ? "dark" : "light");
    } catch (err) {
      console.warn("Storage error:", err);
   }

  }, [dark]);

  const t = translations[lang] || translations.en;
  const isRTL = lang === "ar";

  return (
    <main className={`services-page ${dark ? "dark-theme" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      
      <section className="main-services">
        <h1 className="services-title">{t.title}</h1>
        <p className="services-subtitle">{t.subtitle}</p>

        <div className="services-grid">
          {t.services.map((srv, i) => (
            <div key={i} className="service-card" role="button" tabIndex={0}>
              <img src={srv.icon} alt={srv.name} className="service-icon" />
              <p className="service-name">{srv.name}</p>
            </div>
          ))}
        </div>
      </section>

 
      <section className="featured-services">
        <h2 className="featured-title">{t.featuredTitle}</h2>
        <p className="featured-subtitle">{t.featuredSubtitle}</p>

        <div className="featured-grid">
          {t.featured.map((item, i) => (
            <div key={i} className="featured-card" role="article">
              <img src={item.img} alt={item.text} className="featured-img" />
              <p className="featured-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
