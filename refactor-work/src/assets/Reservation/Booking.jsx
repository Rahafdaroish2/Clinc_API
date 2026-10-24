import { matchesDoctor } from '../../utils/doctors';
import { useEffect, useState } from 'react';
import doctorsData from '/public/doctors.json';
import './Booking.css';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    title: 'Book an Appointment',
    submit: 'Confirm Booking',
    success: '✔️ Thank you! Your appointment request has been received.',
    fields: {
      name: 'Full Name',
      phone: 'Phone Number',
      phoneHelp: 'Include country code, e.g. +963-9xxxxxxxx',
      email: 'Email (Optional)',
      gender: 'Gender',
      age: 'Age (Optional)',
      service: 'Medical Service / Department',
      doctor: 'Preferred Doctor (Optional)',
      doctorHelp: 'Choose a doctor or leave empty for any available specialist.',
      date: 'Select Date',
      time: 'Select Time',
      notes: 'Additional Notes',
      contactMethod: 'Preferred Contact Method',
    },
    genders: ['Male', 'Female'],
    services: ['Cardiology', 'Dentistry', 'Ophthalmology', 'Dermatology', 'General'],
    contactMethods: ['Call', 'WhatsApp', 'Email'],
    searchPlaceholder: 'Search doctor name or specialty',
    searchButton: 'Search',
    noMatch: 'No matching doctor found.',
    requiredMark: '*',
  },
  ar: {
    title: 'حجز موعد',
    submit: 'تأكيد الحجز',
    success: '✔️ شكرًا لك! تم استلام طلبك، وسنتواصل معك قريبًا لتأكيد الموعد.',
    fields: {
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      phoneHelp: 'ضع كود الدولة، مثال: +963-9xxxxxxxx',
      email: 'البريد الإلكتروني (اختياري)',
      gender: 'الجنس',
      age: 'العمر (اختياري)',
      service: 'نوع الخدمة / القسم الطبي',
      doctor: 'الطبيب المفضل (اختياري)',
      doctorHelp: 'اختر طبيبًا أو اتركه فارغًا لاختيار أي مختص متاح.',
      date: 'اختر التاريخ',
      time: 'اختر الوقت',
      notes: 'ملاحظات إضافية',
      contactMethod: 'وسيلة التواصل المفضلة',
    },
    genders: ['ذكر', 'أنثى'],
    services: ['قلب', 'أسنان', 'عيون', 'جلدية', 'عام'],
    contactMethods: ['اتصال', 'واتساب', 'بريد إلكتروني'],
    searchPlaceholder: 'ابحث باسم الدكتور أو تخصصه',
    searchButton: 'بحث',
    noMatch: 'لم يتم العثور على طبيب مطابق.',
    requiredMark: '*',
  },
};

export default function Booking() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || document.documentElement.lang || 'en');
  const [dark, setDark] = useState(() => localStorage.getItem('app_theme') === 'dark' || document.documentElement.classList.contains('dark-theme'));

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', gender: '', age: '',
    service: '', doctor: '', date: '', time: '', notes: '', contactMethod: '',
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [submitted, setSubmitted] = useState(false);


  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const t = translations[lang] || translations.en;

  
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

  
  useEffect(() => {
    if (formData.doctor) {
      const doctor = doctorsData.find(d => d.name === formData.doctor);
      setAvailableDates(doctor?.availableSlots.map(s => s.date) || []);
      setFormData(prev => ({ ...prev, date: '', time: '' }));
      setAvailableTimes([]);
    } else {
      setAvailableDates([]);
      setAvailableTimes([]);
      setFormData(prev => ({ ...prev, date: '', time: '' }));
    }
  }, [formData.doctor]);


  useEffect(() => {
    if (formData.doctor && formData.date) {
      const doctor = doctorsData.find(d => d.name === formData.doctor);
      const day = doctor?.availableSlots.find(s => s.date === formData.date);
      setAvailableTimes(day?.times || []);
      setFormData(prev => day?.times.includes(prev.time) ? prev : { ...prev, time: '' });
    } else {
      setAvailableTimes([]);
      setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [formData.date, formData.doctor]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  
  const handleQueryChange = (v) => {
    setQuery(v);
    if (!v || v.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = v.trim().toLowerCase();
    const matches = doctorsData.filter(doctor => matchesDoctor(doctor, q)).slice(0, 6);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  const handleSelectSuggestion = (doc) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/team#doc-${doc.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    const q = query.trim().toLowerCase();
    const first = doctorsData.find(doctor => matchesDoctor(doctor, q));
    if (first) {
      setShowSuggestions(false);
      setQuery('');
      navigate(`/team#doc-${first.id}`);
    } else {
      alert(t.noMatch);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <main className={`booking-page ${dark ? 'dark-theme' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="booking-title">{t.title}</h1>

      
      <div className="search-block" style={{ margin: '12px 0 18px' }}>
        <form onSubmit={handleSearchSubmit} className="search-form" autoComplete="off">
          <input
            type="search"
            aria-label={t.searchPlaceholder}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="search-input"
          />
          <button type="submit" className="search-btn">{t.searchButton}</button>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="search-suggestions" role="listbox">
              {suggestions.map(s => (
                <li
                  key={s.id}
                  role="option"
                  onMouseDown={(ev) => { ev.preventDefault(); handleSelectSuggestion(s); }}
                  className="suggestion-item"
                >
                  <img src={s.photo} alt={s.name} className="suggestion-thumb" />
                  <div className="suggestion-meta">
                    <div className="suggestion-name">{s.name}</div>
                    <div className="suggestion-specialty">{s.specialty}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {submitted && <div className="booking-success" role="status">{t.success}</div>}

      <form className="booking-form" onSubmit={handleSubmit} aria-labelledby="booking-form-title">
       
        <div className="form-group">
          <label htmlFor="name">{t.fields.name} <span className="req">{t.requiredMark}</span></label>
          <input id="name" name="name" placeholder={t.fields.name} required onChange={handleChange} value={formData.name} aria-required="true" />
          <div className="field-help" id="name-help"></div>
        </div>

        
        <div className="form-group">
          <label htmlFor="phone">{t.fields.phone} <span className="req">{t.requiredMark}</span></label>
          <input id="phone" name="phone" placeholder={t.fields.phone} required onChange={handleChange} value={formData.phone} aria-describedby="phone-help" />
          <div id="phone-help" className="field-help">{t.fields.phoneHelp}</div>
        </div>

       
        <div className="form-group">
          <label htmlFor="email">{t.fields.email}</label>
          <input id="email" name="email" type="email" placeholder={t.fields.email} onChange={handleChange} value={formData.email} aria-describedby="email-help" />
          <div id="email-help" className="field-help">{lang === 'ar' ? 'اختياري — نستخدمه لتأكيد الموعد عبر البريد' : 'Optional — used to send booking confirmation'}</div>
        </div>

        
        <div className="form-group">
          <label htmlFor="gender">{t.fields.gender} <span className="req">{t.requiredMark}</span></label>
          <select id="gender" name="gender" required onChange={handleChange} value={formData.gender} aria-required="true">
            <option value="">{t.fields.gender}</option>
            {t.genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="field-help"></div>
        </div>

       
        <div className="form-group">
          <label htmlFor="age">{t.fields.age}</label>
          <input id="age" name="age" placeholder={t.fields.age} onChange={handleChange} value={formData.age} />
          <div className="field-help">{lang === 'ar' ? 'اختياري — يساعد في اقتراح الطبيب المناسب' : 'Optional — helps suggest the right doctor'}</div>
        </div>

       
        <div className="form-group">
          <label htmlFor="service">{t.fields.service} <span className="req">{t.requiredMark}</span></label>
          <select id="service" name="service" required onChange={handleChange} value={formData.service}>
            <option value="">{t.fields.service}</option>
            {t.services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="field-help"></div>
        </div>

        
        <div className="form-group">
          <label htmlFor="doctor">{t.fields.doctor}</label>
          <select id="doctor" name="doctor" onChange={handleChange} value={formData.doctor} aria-describedby="doctor-help">
            <option value="">{t.fields.doctor}</option>
            {doctorsData.map(d => <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>)}
          </select>
          <div id="doctor-help" className="field-help">{t.fields.doctorHelp}</div>
        </div>

        
        <div className="form-group">
          <label htmlFor="date">{t.fields.date} <span className="req">{t.requiredMark}</span></label>
          <select id="date" name="date" required onChange={handleChange} value={formData.date}>
            <option value="">{t.fields.date}</option>
            {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
          </select>
          <div className="field-help">{lang === 'ar' ? 'التواريخ مأخوذة من جدول دوام الطبيب المختار' : 'Dates are pulled from the selected doctor schedule'}</div>
        </div>

       
        <div className="form-group">
          <label htmlFor="time">{t.fields.time} <span className="req">{t.requiredMark}</span></label>
          <select id="time" name="time" required onChange={handleChange} value={formData.time}>
            <option value="">{t.fields.time}</option>
            {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
          </select>
          <div className="field-help">{lang === 'ar' ? 'اختر من الأوقات المتاحة فقط' : 'Choose only from available times'}</div>
        </div>

       
        <div className="form-group fullwidth">
          <label htmlFor="notes">{t.fields.notes}</label>
          <textarea id="notes" name="notes" placeholder={t.fields.notes} onChange={handleChange} value={formData.notes}></textarea>
          <div className="field-help">{lang === 'ar' ? 'أضف معلومات إضافية إن وُجدت' : 'Add additional info or conditions if any'}</div>
        </div>

       
        <div className="form-group">
          <label htmlFor="contactMethod">{t.fields.contactMethod} <span className="req">{t.requiredMark}</span></label>
          <select id="contactMethod" name="contactMethod" required onChange={handleChange} value={formData.contactMethod}>
            <option value="">{t.fields.contactMethod}</option>
            {t.contactMethods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="field-help"></div>
        </div>

        <div className="form-actions fullwidth">
          <button type="submit" className="btn-submit">{t.submit}</button>
        </div>
      </form>
    </main>
  );
}
