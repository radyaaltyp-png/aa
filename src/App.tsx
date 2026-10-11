import { useMemo, useState } from 'react'
import './style.css'

type Doctor = { id: number; name: string; specialty: string; rating: string; experience: string; price: string; color: string; initials: string }
const doctors: Doctor[] = [
  { id: 1, name: 'د. مريم أحمد', specialty: 'طب الأطفال', rating: '4.9', experience: '12 سنة خبرة', price: '250 ج.م', color: 'mint', initials: 'م' },
  { id: 2, name: 'د. عمر خالد', specialty: 'القلب والأوعية الدموية', rating: '4.8', experience: '9 سنوات خبرة', price: '300 ج.م', color: 'blue', initials: 'ع' },
  { id: 3, name: 'د. سارة محمود', specialty: 'الجلدية', rating: '5.0', experience: '8 سنوات خبرة', price: '220 ج.م', color: 'pink', initials: 'س' },
  { id: 4, name: 'د. يوسف علي', specialty: 'العظام', rating: '4.7', experience: '15 سنة خبرة', price: '280 ج.م', color: 'gold', initials: 'ي' },
]
const specialties = [
  { icon: '🩺', name: 'الطب العام', count: '120 طبيب' },
  { icon: '🧒', name: 'طب الأطفال', count: '48 طبيب' },
  { icon: '❤️', name: 'القلب', count: '36 طبيب' },
  { icon: '✨', name: 'الجلدية', count: '52 طبيب' },
  { icon: '🦴', name: 'العظام', count: '41 طبيب' },
  { icon: '🧠', name: 'الأعصاب', count: '27 طبيب' },
]
function App() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const filteredDoctors = useMemo(() => doctors.filter(d => (!specialty || d.specialty.includes(specialty) || specialty === 'القلب' && d.specialty.includes('القلب')) && (!query || (d.name + d.specialty).toLowerCase().includes(query.toLowerCase()))), [query, specialty])
  const book = (doctor: Doctor) => { setSelectedDoctor(doctor); setSubmitted(false) }
  return (
    <div className="site" dir="rtl">
      <div className="topline"><span>✦ صحتك تستحق أفضل رعاية</span><span className="topline-contact">هل تحتاج مساعدة؟ <a href="mailto:hello@sahty.example">تواصل معنا</a></span></div>
      <header className="header">
        <a className="brand" href="#home" aria-label="صحتي - الرئيسية"><span className="brand-icon">✚</span><span>صحتي<small>رعايتك أقرب</small></span></a>
        <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="فتح القائمة">☰</button>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#home" onClick={() => setMobileMenu(false)}>الرئيسية</a><a href="#specialties" onClick={() => setMobileMenu(false)}>التخصصات</a><a href="#doctors" onClick={() => setMobileMenu(false)}>الأطباء</a><a href="#how" onClick={() => setMobileMenu(false)}>كيف تعمل</a>
        </nav>
        <a className="header-cta" href="#doctors">احجز موعدك <span>↙</span></a>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse-dot" /> رعاية صحية أسهل، لحياة أفضل</div>
            <h1>صحتك أولويتنا،<br /><span>ورعايتك أقرب</span></h1>
            <p className="hero-description">اكتشف أطباء موثوقين، واختر التخصص المناسب، وابدأ رحلتك نحو صحة أفضل بخطوات بسيطة.</p>
            <div className="hero-actions"><a className="button primary" href="#doctors">ابحث عن طبيب <span>←</span></a><a className="text-link" href="#how"><span className="play">▶</span> كيف تعمل صحتي؟</a></div>
            <div className="trust-row"><div className="avatars"><span>م</span><span>ع</span><span>س</span><span>+</span></div><div><strong>رعايتك تبدأ من هنا</strong><small>اختيار أسهل ومعلومات واضحة</small></div><div className="trust-stars">★★★★★<small>تجربة صحية أبسط</small></div></div>
          </div>
          <div className="hero-art">
            <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
            <div className="hero-blob"><div className="doctor-illustration"><div className="doctor-hair"></div><div className="doctor-face"><span className="eye eye-a"></span><span className="eye eye-b"></span><span className="smile"></span></div><div className="doctor-neck"></div><div className="doctor-coat"><div className="coat-neck"></div><div className="coat-pocket">✚</div></div><div className="stethoscope"></div></div></div>
            <div className="float-card card-verified"><span className="verified-icon">✓</span><div><strong>أطباء موثوقون</strong><small>اختيارات تناسب احتياجك</small></div></div>
            <div className="float-card card-care"><span className="care-icon">♡</span><div><strong>اهتمام بصحتك</strong><small>في كل خطوة</small></div></div>
            <div className="sparkle sparkle-a">✦</div><div className="sparkle sparkle-b">✧</div>
          </div>
          <div className="hero-bottom"><span>↓</span> اكتشف خدمات صحتي</div>
        </section>
        <section className="stats"><div><strong>+300</strong><span>طبيب وتخصص</span></div><div><strong>+20</strong><span>تخصص طبي</span></div><div><strong>24/7</strong><span>المعلومات متاحة دائمًا</span></div><div className="stats-note"><span>✚</span><p>خطوتك الأولى<br />نحو صحة أفضل</p></div></section>
        <section className="section specialties-section" id="specialties"><div className="section-heading"><div><span className="section-kicker">خدماتنا الطبية</span><h2>اختار التخصص <span>المناسب ليك</span></h2><p>ابحث بسهولة عن الرعاية التي تحتاجها.</p></div><a href="#doctors" className="subtle-link">كل التخصصات <span>←</span></a></div><div className="specialty-grid">{specialties.map(s => <button key={s.name} className={specialty === s.name ? 'specialty active' : 'specialty'} onClick={() => { setSpecialty(specialty === s.name ? '' : s.name); document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' }) }}><span className="specialty-icon">{s.icon}</span><strong>{s.name}</strong><small>{s.count}</small><span className="specialty-arrow">↙</span></button>)}</div></section>
        <section className="section doctors-section" id="doctors"><div className="section-heading"><div><span className="section-kicker">فريق الرعاية</span><h2>تعرّف على <span>أطبائنا</span></h2><p>اختيارات توضيحية لتجربة تصفح الأطباء.</p></div><div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بالاسم أو التخصص..." aria-label="البحث عن طبيب" />{(query || specialty) && <button onClick={() => { setQuery(''); setSpecialty('') }}>مسح</button>}</div></div>{specialty && <div className="filter-note">التخصص المختار: {specialty} <button onClick={() => setSpecialty('')}>إزالة ×</button></div>}<div className="doctor-grid">{filteredDoctors.map(d => <article className="doctor-card" key={d.id}><div className={'doctor-avatar ' + d.color}><span>{d.initials}</span><i>✓</i></div><div className="doctor-rating">★ {d.rating}</div><h3>{d.name}</h3><p className="doctor-specialty">{d.specialty}</p><div className="doctor-meta"><span>♧ {d.experience}</span><span>◷ مواعيد بالحجز</span></div><div className="doctor-card-bottom"><div><small>سعر الكشف (مثال)</small><strong>{d.price}</strong></div><button onClick={() => book(d)}>احجز الآن <span>←</span></button></div></article>)}</div>{filteredDoctors.length === 0 && <div className="empty-state">مفيش نتائج مطابقة. جرّب اسم أو تخصص تاني.</div>}<p className="demo-note">تنبيه: بيانات الأطباء والأسعار المعروضة تجريبية للتصميم وليست قائمة طبية فعلية.</p></section>
        <section className="how-section" id="how"><div className="how-heading"><span className="section-kicker">بكل بساطة</span><h2>الرعاية الصحية في <span>3 خطوات</span></h2><p>خلّي الوصول للرعاية المناسبة أسهل من أي وقت.</p></div><div className="steps"><div className="step"><span className="step-number">01</span><div className="step-icon">⌕</div><h3>ابحث عن طبيب</h3><p>اختار التخصص أو ابحث عن الطبيب المناسب.</p></div><div className="step-connector">╌╌╌›</div><div className="step"><span className="step-number">02</span><div className="step-icon">▦</div><h3>اختار موعدك</h3><p>حدّد اليوم والوقت اللي يناسبك.</p></div><div className="step-connector">╌╌╌›</div><div className="step"><span className="step-number">03</span><div className="step-icon">♡</div><h3>اهتم بصحتك</h3><p>تابع طلبك وتجهّز لزيارتك الطبية.</p></div></div></section>
        <section className="cta-section"><div className="cta-mark">✚</div><div><span className="section-kicker">ابدأ رحلتك اليوم</span><h2>خلي صحتك دايمًا في المقدمة</h2><p>اكتشف التخصصات والأطباء المتاحين في تجربة صحتي.</p></div><a className="button light" href="#doctors">اكتشف الأطباء <span>←</span></a><div className="cta-decoration">✦</div></section>
      </main>
      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-icon">✚</span><span>صحتي<small>رعايتك أقرب</small></span></a><p>واجهة تجريبية لخدمات صحية رقمية.</p><div><a href="#specialties">التخصصات</a><a href="#doctors">الأطباء</a><a href="mailto:hello@sahty.example">تواصل معنا</a></div><small>© 2026 صحتي — نسخة تجريبية</small></footer>
      {selectedDoctor && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedDoctor(null) }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={() => setSelectedDoctor(null)} aria-label="إغلاق">×</button>{submitted ? <div className="success-state"><span>✓</span><h2>تم تجهيز طلبك التجريبي</h2><p>دي واجهة معاينة فقط؛ لم يتم إرسال حجز حقيقي أو حفظ بياناتك.</p><button className="button primary" onClick={() => setSelectedDoctor(null)}>تمام</button></div> : <><span className="section-kicker">طلب حجز تجريبي</span><h2 id="booking-title">احجز مع {selectedDoctor.name}</h2><p className="modal-desc">{selectedDoctor.specialty} · {selectedDoctor.price} (سعر توضيحي)</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}><label>اسمك<input required placeholder="اكتب اسمك" /></label><label>رقم الموبايل<input required type="tel" inputMode="tel" placeholder="01xxxxxxxxx" pattern="[0-9+ ()-]{8,20}" /></label><div className="form-row"><label>اليوم<input required type="date" min={new Date().toISOString().slice(0, 10)} /></label><label>الوقت<select required defaultValue=""><option value="" disabled>اختار وقت</option><option>10:00 صباحًا</option><option>12:00 ظهرًا</option><option>04:00 مساءً</option><option>06:00 مساءً</option></select></label></div><p className="form-disclaimer">للمعاينة فقط: الطلب لن يُرسل إلى طبيب أو عيادة.</p><button className="button primary submit-button" type="submit">معاينة الطلب <span>←</span></button></form></>}</section></div>}
    </div>
  )
}
export default App
