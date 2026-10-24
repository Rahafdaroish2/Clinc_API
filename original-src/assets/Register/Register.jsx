import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const translations = {
  en: {
    title: "Create Account",
    socialHint: "Sign up with",
    or: "— OR —",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    confirm: "Confirm Password",
    submit: "Create Account",
    haveAccount: "Already have an account? Log in",
  },
  ar: {
    title: "إنشاء حساب",
    socialHint: "سجل عبر",
    or: "— أو —",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirm: "تأكيد كلمة المرور",
    submit: "إنشاء حساب",
    haveAccount: "هل لديك حساب؟ تسجيل الدخول",
  },
};

export default function Register() {
 
  const safeGet = (k, fallback) => {
    try {
      if (typeof window === "undefined") return fallback;
      return localStorage.getItem(k) || fallback;
    } catch {
      return fallback;
    }
  };

  const [lang, setLang] = useState(() => safeGet("app_lang", document.documentElement.lang || "en"));
  const [dark, setDark] = useState(() => safeGet("app_theme", "") === "dark" || document.documentElement.classList.contains("dark-theme"));


  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(false);

 
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

  const t = translations[lang] || translations.en;
  const isRTL = lang === "ar";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (form.password && form.password !== form.confirm) {
      alert(lang === "ar" ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
      return;
    }
    setSubmitted(true);
    console.log("Register data:", form);
   
  };

  return (
    <main className={`register-shell ${dark ? "dark-theme" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="register-card">
        
        <aside className="register-left" aria-hidden>
          <img src="/src/image/download (30).jfif" alt="" className="left-illustration" />
        </aside>

       
        <section className="register-right">
          <h2 className="reg-title">{t.title}</h2>

          <div className="social-row">
            <button className="btn-social google" type="button">
              <svg viewBox="0 0 24 24" className="social-svg"><path d="M21.35 11.1h-9.36v2.92h5.36c-.23 1.3-.94 2.4-2.01 3.12v2.58h3.25c1.9-1.75 3-4.33 3-7.6 0-.6-.05-1.18-.29-1.99z"/></svg>
              <span>{lang === "ar" ? "سجل عبر Google" : "Sign up with Google"}</span>
            </button>

            <button className="btn-social fb" type="button">
              <svg viewBox="0 0 24 24" className="social-svg"><path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H8.1v-2.9h2.34V9.41c0-2.31 1.37-3.59 3.47-3.59.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.69h2.5l-.4 2.9h-2.1v7.03C18.34 21.2 22 17.06 22 12.07z"/></svg>
              <span>{lang === "ar" ? "سجل عبر Facebook" : "Sign up with Facebook"}</span>
            </button>
          </div>

          <div className="or">{t.or}</div>

          <form className="reg-form" onSubmit={handleSubmit}>
            <input name="name" placeholder={t.fullName} value={form.name} onChange={handleChange} required />

            <input name="email" type="email" placeholder={t.email} value={form.email} onChange={handleChange} required />

            <div className="pw-row">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder={t.password}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPass((s) => !s)} aria-pressed={showPass}>
                {showPass ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "إظهار" : "Show")}
              </button>
            </div>

            <input
              name="confirm"
              type="password"
              placeholder={t.confirm}
              value={form.confirm}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-primary">{t.submit}</button>
          </form>

          {submitted && (
            <div className="reg-success" role="status">
              {lang === "ar" ? "تم إنشاء الحساب بنجاح (تمثيلي)." : "Account created successfully (mock)."}
            </div>
          )}

          <div className="reg-bottom">
            <Link to="/login">{t.haveAccount}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
