import { readStoredValue } from '../../utils/storage';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const translations = {
  en: {
    title: 'Sign in to Orion.',
    subtitle: 'Enter your details below.',
    username: 'Email or Username',
    password: 'Password',
    forgot: 'Forgot Password?',
    login: 'Log in',
    socialHint: 'Sign in With Social Account',
    create: 'Create new account.',
    or: 'or',
  },
  ar: {
    title: 'تسجيل الدخول',
    subtitle: 'أدخل بياناتك أدناه.',
    username: 'البريد أو اسم المستخدم',
    password: 'كلمة المرور',
    forgot: 'هل نسيت كلمة المرور؟',
    login: 'تسجيل الدخول',
    socialHint: 'تسجيل عبر حساب اجتماعي',
    create: 'إنشاء حساب جديد.',
    or: 'أو',
  },
};

export default function Login() {
  

  const [lang, setLang] = useState(() => readStoredValue('app_lang', document.documentElement.lang || 'en'));
  const [dark, setDark] = useState(() => readStoredValue('app_theme', '') === 'dark' || document.documentElement.classList.contains('dark-theme'));


  const [form, setForm] = useState({ user: '', pass: '' });
  const [submitted, setSubmitted] = useState(false);

  
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const currentLang = document.documentElement.lang || 'en';
      const isDark = document.documentElement.classList.contains('dark-theme');
      if (currentLang !== lang) setLang(currentLang);
      if (isDark !== dark) setDark(isDark);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    return () => obs.disconnect();
  }, [lang, dark]);

 
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';

  return (
    <main className={`login-shell ${dark ? 'dark-theme' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="login-card">
       
        <div className="login-left">
          <div className="brand">
            <img src="/public/Gemini_Generated_Image_bnvjo2bnvjo2bnvj-removebg-preview.png" alt="logo" className="login-logo" />
            <span className="brand-name">CareAmor</span>
          </div>

          <h2 className="login-title">{t.title}</h2>
          <p className="login-sub">{t.subtitle}</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="sr-only">{t.username}</label>
            <input
              name="user"
              value={form.user}
              onChange={handleChange}
              placeholder={t.username}
              required
              className="input"
            />

            <label className="sr-only">{t.password}</label>
            <input
              name="pass"
              type="password"
              value={form.pass}
              onChange={handleChange}
              placeholder={t.password}
              required
              className="input"
            />

            <div className="row-between">
              <Link to="/forgot" className="forgot-link">{t.forgot}</Link>
            </div>

            <button type="submit" className="btn-primary">{t.login}</button>

            {submitted && (
              <div className="login-note" role="status">
                
                {lang === 'ar' ? 'تم إرسال بيانات تسجيل الدخول (وهمي).' : 'Login data submitted (mock).'}
              </div>
            )}

            <div className="social-block">
              <div className="social-hint">{t.socialHint}</div>
              <div className="social-buttons">
                <button type="button" className="social-btn fb" aria-label="Login with Facebook">
                  <svg viewBox="0 0 24 24" className="social-icon"><path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H8.1v-2.9h2.34V9.41c0-2.31 1.37-3.59 3.47-3.59.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.69h2.5l-.4 2.9h-2.1v7.03C18.34 21.2 22 17.06 22 12.07z" /></svg>
                  <span>Facebook</span>
                </button>

                <button type="button" className="social-btn gp" aria-label="Login with Google">
                  <svg viewBox="0 0 24 24" className="social-icon"><path d="M21.35 11.1h-9.36v2.92h5.36c-.23 1.3-.94 2.4-2.01 3.12v2.58h3.25c1.9-1.75 3-4.33 3-7.6 0-.6-.05-1.18-.29-1.99z"/><path d="M12 22c2.7 0 4.98-.9 6.64-2.45l-3.25-2.58c-.9.6-2.03.96-3.39.96-2.6 0-4.8-1.76-5.58-4.13H3.02v2.6C4.68 19.77 8.06 22 12 22z"/><path d="M6.42 13.8A5.996 5.996 0 0112 7.99c1.07 0 2.07.3 2.88.83l2.16-2.16C15.92 4.99 14.06 4 12 4 8.06 4 4.68 6.23 3.02 9.62l3.4 2.18z"/></svg>
                  <span>Google</span>
                </button>
              </div>
            </div>

            <div className="create-link">
              <span>{t.or} </span>
              <Link to="/register">{t.create}</Link>
            </div>
          </form>
        </div>

        
        <div className="login-right" aria-hidden>
          <img src="/src/image/The Healing Touch of a Nurse.jfif" alt="" className="login-side-img" />
        </div>
      </div>
    </main>
  );
}
