import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const subjects = [
  { id: 'math', title: 'חשבון', subtitle: 'מספרים, חיבור וחיסור', emoji: '🔢', color: 'blue' },
  { id: 'hebrew', title: 'עברית', subtitle: 'קוראים וכותבים', emoji: '📚', color: 'pink' },
  { id: 'english', title: 'אנגלית', subtitle: 'מילים ומשפטים ראשונים', emoji: '🔤', color: 'purple' },
  { id: 'science', title: 'מדעים', subtitle: 'מגלים איך העולם עובד', emoji: '🔬', color: 'green' },
]

const games = [
  { title: 'מרוץ החיבור', subject: 'חשבון', emoji: '🏁', description: 'פותרים תרגילי חיבור עד 100', kind: 'math' },
  { title: 'מילה חסרה', subject: 'עברית', emoji: '🧩', description: 'משלימים מילה במשפט', kind: 'word' },
  { title: 'זיכרון באנגלית', subject: 'אנגלית', emoji: '🃏', description: 'מתאימים מילה לתרגום', kind: 'english' },
  { title: 'חוקר הטבע', subject: 'מדעים', emoji: '🌱', description: 'שאלות קצרות על הטבע', kind: 'science' },
]

const videos = [
  { title: 'סרטוני חשבון לכיתה ב׳', detail: 'חיפוש סרטונים לימודיים', emoji: '🎥', url: 'https://www.youtube.com/results?search_query=חשבון+כיתה+ב+סרטונים' },
  { title: 'סרטוני עברית וקריאה', detail: 'אותיות, ניקוד והבנת הנקרא', emoji: '📖', url: 'https://www.youtube.com/results?search_query=עברית+כיתה+ב+קריאה+סרטונים' },
  { title: 'אנגלית לילדים', detail: 'אותיות, מילים ושירים', emoji: '🌈', url: 'https://www.youtube.com/results?search_query=אנגלית+לילדים+כיתה+ב' },
  { title: 'מדעים לילדים', detail: 'ניסויים ותופעות טבע', emoji: '🪐', url: 'https://www.youtube.com/results?search_query=מדעים+לילדים+כיתה+ב' },
  { title: 'אופק – מרחב לימודי', detail: 'פתיחת אתר אופק של מטח', emoji: '🧭', url: 'https://students.myofek.cet.ac.il/' },
  { title: 'גלים פרו', detail: 'סביבת למידה דיגיטלית', emoji: '🐬', url: 'https://pro.galim.org.il/' },
]

const questions = {
  math: [
    { q: 'כמה הם 27 + 15?', options: ['32', '42', '52'], answer: '42', explain: '27 + 10 = 37, ועוד 5 = 42.' },
    { q: 'כמה הם 60 − 24?', options: ['36', '44', '46'], answer: '36', explain: '60 − 20 = 40, ואז מורידים עוד 4.' },
    { q: 'איזה מספר גדול יותר?', options: ['48', '84', 'שווים'], answer: '84', explain: '84 גדול מ־48.' },
    { q: 'כמה עשרות יש במספר 73?', options: ['3', '7', '73'], answer: '7', explain: 'במספר 73 יש 7 עשרות ו־3 יחידות.' },
  ],
  word: [
    { q: 'השלימו: בבוקר השמש ___ בשמיים.', options: ['זורחת', 'ישן', 'אוכלים'], answer: 'זורחת', explain: 'השמש זורחת בבוקר.' },
    { q: 'מהי מילה נרדפת ל״שמח״?', options: ['עצוב', 'עליז', 'עייף'], answer: 'עליז', explain: 'שמח ועליז הן מילים בעלות משמעות דומה.' },
    { q: 'איזו מילה היא שם של בעל חיים?', options: ['מחברת', 'אריה', 'חלון'], answer: 'אריה', explain: 'אריה הוא בעל חיים.' },
  ],
  english: [
    { q: 'מה פירוש המילה CAT?', options: ['כלב', 'חתול', 'ציפור'], answer: 'חתול', explain: 'CAT פירושו חתול.' },
    { q: 'איך אומרים ״שלום״ באנגלית?', options: ['Hello', 'Book', 'Blue'], answer: 'Hello', explain: 'Hello היא ברכת שלום באנגלית.' },
    { q: 'מה פירוש RED?', options: ['כחול', 'ירוק', 'אדום'], answer: 'אדום', explain: 'RED הוא הצבע אדום.' },
  ],
  science: [
    { q: 'מה צמח צריך כדי לגדול?', options: ['מים ואור', 'צעצועים', 'נעליים'], answer: 'מים ואור', explain: 'צמחים זקוקים למים, לאור, לאוויר ולחומרים מהקרקע.' },
    { q: 'באיזה מצב צבירה נמצא קרח?', options: ['נוזל', 'מוצק', 'גז'], answer: 'מוצק', explain: 'קרח הוא מים במצב מוצק.' },
    { q: 'איזה איבר עוזר לנו לנשום?', options: ['ריאות', 'ברכיים', 'אוזניים'], answer: 'ריאות', explain: 'הריאות מאפשרות לנו לנשום.' },
  ],
}

function App() {
  const [active, setActive] = useState('home')
  const [gameKind, setGameKind] = useState('math')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [points, setPoints] = useState(() => Number(localStorage.getItem('eily-points') || 0))
  const [done, setDone] = useState(() => Number(localStorage.getItem('eily-done') || 0))
  const [wordInput, setWordInput] = useState('')
  const [readingText, setReadingText] = useState('')

  const currentQuestions = questions[gameKind] || questions.math
  const currentQuestion = currentQuestions[questionIndex % currentQuestions.length]

  function startGame(kind) {
    setGameKind(kind)
    setQuestionIndex(0)
    setSelected('')
    setChecked(false)
    setActive('game')
  }

  function checkAnswer() {
    if (!selected || checked) return
    setChecked(true)
    if (selected === currentQuestion.answer) {
      const nextPoints = points + 10
      const nextDone = done + 1
      setPoints(nextPoints); setDone(nextDone)
      localStorage.setItem('eily-points', String(nextPoints))
      localStorage.setItem('eily-done', String(nextDone))
    }
  }

  function nextQuestion() {
    setQuestionIndex(i => (i + 1) % currentQuestions.length)
    setSelected('')
    setChecked(false)
  }

  const subjectTitle = subjects.find(s => s.id === gameKind)?.title || 'משחקון'
  const progress = Math.min(100, (done % 10) * 10)

  return <div className="site-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setActive('home')} aria-label="לעמוד הבית">
        <span className="brand-mark">✦</span><span>עולם הלמידה שלי</span>
      </button>
      <nav>
        <button className={active === 'home' ? 'nav-active' : ''} onClick={() => setActive('home')}>בית</button>
        <button className={active === 'subjects' ? 'nav-active' : ''} onClick={() => setActive('subjects')}>מקצועות</button>
        <button className={active === 'videos' ? 'nav-active' : ''} onClick={() => setActive('videos')}>סרטונים</button>
        <button className={active === 'reading' ? 'nav-active' : ''} onClick={() => setActive('reading')}>קוראים וכותבים</button>
      </nav>
      <div className="points-pill">⭐ {points} נקודות</div>
    </header>

    <main>
      {active === 'home' && <>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">לומדים • משחקים • מצליחים</span>
            <h1>היי, אלוף הלמידה! <span>🚀</span><br/>מוכנים לגלות דברים חדשים?</h1>
            <p>מרחב למידה צבעוני לכיתה ב׳ עם משחקונים קצרים, סרטונים ופעילויות שאפשר לעשות בכל יום.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setActive('subjects')}>בואו ללמוד <span>←</span></button>
              <button className="secondary" onClick={() => setActive('videos')}>לסרטונים ▶</button>
            </div>
            <div className="tiny-note">🌟 כל תשובה נכונה מוסיפה 10 נקודות</div>
          </div>
          <div className="hero-art" aria-label="איור של ספרים, כוכבים ועפרונות">
            <div className="sun-shape">☀️</div><div className="floating-star star-one">✦</div><div className="floating-star star-two">✧</div>
            <div className="book book-back">📘</div><div className="book book-front">📚</div><div className="pencil">✏️</div>
            <div className="cloud cloud-one"></div><div className="cloud cloud-two"></div>
          </div>
        </section>

        <section className="stats-row">
          <div className="stat-card"><span className="stat-icon">🏆</span><div><strong>{points}</strong><small>נקודות שצברתי</small></div></div>
          <div className="stat-card"><span className="stat-icon">✅</span><div><strong>{done}</strong><small>תשובות נכונות</small></div></div>
          <div className="stat-card"><span className="stat-icon">🎯</span><div><strong>{10 - (done % 10)}</strong><small>עד פרס הנקודות הבא</small></div></div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="eyebrow">בוחרים מה לומדים</span><h2>המקצועות שלי</h2></div><button className="text-link" onClick={() => setActive('subjects')}>לכל המקצועות ←</button></div>
          <div className="subject-grid">{subjects.map(s => <button className={`subject-card ${s.color}`} key={s.id} onClick={() => startGame(s.id)}><span className="subject-emoji">{s.emoji}</span><span className="subject-title">{s.title}</span><span className="subject-subtitle">{s.subtitle}</span><span className="card-arrow">←</span></button>)}</div>
        </section>

        <section className="section-block game-highlight">
          <div className="game-copy"><span className="eyebrow">הפסקת משחק 🎮</span><h2>משחקון קצר, חיוך גדול!</h2><p>כמה דקות של תרגול יעזרו לך להתחזק. בחרו משחק והתחילו לצבור נקודות.</p><button className="primary" onClick={() => startGame(['math','word','english','science'][Math.floor(Math.random()*4)])}>התחילו לשחק ←</button></div>
          <div className="game-illustration">🧠<span>✨</span><small>אתגר יומי</small></div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="eyebrow">צופים ולומדים</span><h2>סרטונים ואתרי למידה</h2></div><button className="text-link" onClick={() => setActive('videos')}>לכל הסרטונים ←</button></div>
          <div className="video-grid">{videos.slice(0,3).map(v => <a className="video-card" key={v.title} href={v.url} target="_blank" rel="noreferrer"><span className="video-thumb">{v.emoji}<i>▶</i></span><strong>{v.title}</strong><small>{v.detail}</small></a>)}</div>
        </section>
      </>}

      {active === 'subjects' && <section className="page-section"><span className="eyebrow">המסע שלך מתחיל כאן</span><h1>מה בא לך ללמוד היום?</h1><p className="page-intro">בחרו מקצוע כדי להתחיל במשחקון קצר. כל תשובה נכונה שווה 10 נקודות.</p><div className="subject-grid">{subjects.map(s => <button className={`subject-card ${s.color}`} key={s.id} onClick={() => startGame(s.id)}><span className="subject-emoji">{s.emoji}</span><span className="subject-title">{s.title}</span><span className="subject-subtitle">{s.subtitle}</span><span className="card-arrow">←</span></button>)}</div><div className="practice-list"><h2>תרגול מהיר</h2>{games.map(g => <button key={g.kind} className="practice-row" onClick={() => startGame(g.kind)}><span>{g.emoji}</span><span><b>{g.title}</b><small>{g.description}</small></span><span className="row-arrow">←</span></button>)}</div></section>}

      {active === 'game' && <section className="page-section game-page"><button className="back-link" onClick={() => setActive('subjects')}>→ חזרה למקצועות</button><div className="game-panel"><span className="game-big-emoji">{subjects.find(s => s.id === gameKind)?.emoji || '🧩'}</span><span className="eyebrow">משחקון • {subjectTitle}</span><h1>{currentQuestion.q}</h1><div className="answer-list">{currentQuestion.options.map(option => <button key={option} disabled={checked} className={`answer-option ${selected === option ? 'selected' : ''} ${checked && option === currentQuestion.answer ? 'correct' : ''} ${checked && selected === option && selected !== currentQuestion.answer ? 'incorrect' : ''}`} onClick={() => setSelected(option)}>{option}{checked && option === currentQuestion.answer ? ' ✓' : ''}</button>)}</div>{checked && <div className={`feedback ${selected === currentQuestion.answer ? 'feedback-good' : 'feedback-bad'}`}>{selected === currentQuestion.answer ? 'כל הכבוד! תשובה נכונה 🎉' : 'כמעט! ננסה שוב בפעם הבאה.'}<small>{currentQuestion.explain}</small></div>}<div className="game-controls">{!checked ? <button className="primary" onClick={checkAnswer} disabled={!selected}>בדיקת תשובה</button> : <button className="primary" onClick={nextQuestion}>לשאלה הבאה ←</button>}<span>⭐ {points} נקודות</span></div></div></section>}

      {active === 'videos' && <section className="page-section"><span className="eyebrow">לומדים גם בצפייה</span><h1>סרטונים ואתרי למידה 🎬</h1><p className="page-intro">בחרו נושא כדי לפתוח סרטונים או אתר לימודי. הקישורים נפתחים בחלון חדש.</p><div className="video-grid video-grid-large">{videos.map(v => <a className="video-card" key={v.title} href={v.url} target="_blank" rel="noreferrer"><span className="video-thumb">{v.emoji}<i>▶</i></span><strong>{v.title}</strong><small>{v.detail}</small><span className="open-link">פתיחה ←</span></a>)}</div><p className="parent-note">הערה להורים: הקישורים לאתרי צד שלישי ולתוצאות חיפוש עשויים להשתנות. מומלץ לפתוח סרטונים יחד עם מבוגר ולבחור תוכן שמתאים לגיל.</p></section>}

      {active === 'reading' && <section className="page-section reading-page"><span className="eyebrow">קוראים, חושבים וכותבים</span><h1>פינת הקריאה והכתיבה ✍️</h1><div className="reading-layout"><article className="reading-card"><span className="reading-label">סיפור קצר</span><h2>הזרע הקטן</h2><p>בגינה של נועה היה זרע קטן. נועה שתלה אותו באדמה, השקה אותו בכל יום ודאגה שיקבל אור שמש. אחרי כמה ימים הופיע נבט ירוק. נועה שמחה והמשיכה לטפל בצמח שלה.</p><h3>שאלות להבנת הנקרא</h3><ol><li>מה שתלה נועה באדמה?</li><li>מה הצמח צריך כדי לגדול?</li><li>איך הרגישה נועה כשראתה את הנבט?</li></ol><label htmlFor="reading-answer">כתבו תשובה או סיפור קצר משלכם:</label><textarea id="reading-answer" value={readingText} onChange={e => setReadingText(e.target.value)} placeholder="אני חושב/ת ש..." rows="5"/><button className="primary" onClick={() => { if (readingText.trim()) { setPoints(p => {const n=p+5;localStorage.setItem('eily-points',String(n));return n}); alert('כל הכבוד על הכתיבה! קיבלת 5 נקודות 🌟'); setReadingText('') } }} disabled={!readingText.trim()}>סיימתי לכתוב (+5 נקודות)</button></article><article className="reading-card writing-card"><span className="reading-label">תרגול כתיבה</span><h2>משימת היום</h2><p>כתבו 3 משפטים על מקום שאתם אוהבים לבקר בו.</p><ul><li>מה שם המקום?</li><li>עם מי אתם הולכים לשם?</li><li>מה אתם הכי אוהבים לעשות שם?</li></ul><div className="writing-tip">💡 טיפ קטן: מתחילים משפט באות גדולה באנגלית, ובעברית מקפידים על רווחים בין המילים.</div><button className="secondary full" onClick={() => setReadingText('המקום שאני אוהב/ת הוא...\nאני הולך/ת לשם עם...\nאני הכי אוהב/ת שם...')}>הוסיפו תבנית לכתיבה</button></article></div></section>}

    </main>
    <footer><div className="footer-brand"><span className="brand-mark">✦</span> עולם הלמידה שלי</div><p>לומדים קצת בכל יום, ומתקדמים צעד אחר צעד 🌱</p><small>אתר תרגול לימודי לכיתה ב׳ • נבנה ללמידה מהנה ובטוחה</small></footer>
  </div>
}

createRoot(document.getElementById('app')).render(<App />)
