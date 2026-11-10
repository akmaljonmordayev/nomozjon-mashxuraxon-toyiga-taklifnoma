import { useEffect, useMemo, useRef, useState } from 'react'
import { burst, initFx, salute, startAuto } from './fx.js'
import { onMusicState, toggleMusic } from './music.js'
import { CALM, LITE } from './perf.js'
import { drum } from './doira.js'

const MAP = "https://www.google.com/maps?q=38.136604,67.716076"
const WEDDING = new Date('2026-11-22T09:00:00+05:00')
const rand = (a, b) => a + Math.random() * (b - a)
const HEART_D = 'M12 21.2C5 15.6 1.2 12 1.2 7.4 1.2 4 3.8 1.6 7 1.6c2 0 3.7 1 5 2.8 1.3-1.8 3-2.8 5-2.8 3.2 0 5.8 2.4 5.8 5.8 0 4.6-3.8 8.2-10.8 13.8Z'

const Heart = ({ className = '', style }) => (
  <svg className={className} style={style} viewBox="0 0 24 22" aria-hidden="true"><path d={HEART_D} fill="currentColor" /></svg>
)

/* suzani guli: sakkiz bargli gul */
const Gul = ({ className = '' }) => (
  <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => <path key={r} transform={`rotate(${r})`} d="M0-8C10-22 10-38 0-48-10-38-10-22 0-8Z" />)}
    <circle r="6" fill="currentColor" />
  </svg>
)

/* ---------- Uzum boshi ---------- */
function Grapes({ open }) {
  const berries = useMemo(() => {
    const rows = [5, 4, 3, 2, 1], out = []
    rows.forEach((n, i) => { for (let j = 0; j < n; j++) {
      const x = 100 + (j - (n - 1) / 2) * 29, y = 66 + i * 27
      out.push({ x, y, k: (i + j) % 3, dx: (x - 100) * 2.2 + rand(-14, 14), dy: (y - 110) * 1.6 + rand(-10, 30), d: rand(0, .25) })
    } })
    return out
  }, [])
  return (
    <svg className={`uzum ${open ? 'is-open' : ''}`} viewBox="0 0 200 200" role="img" aria-label="Uzum boshi">
      <defs>
        {[['#b26ad8', '#7a2fa6', '#3a1355'], ['#9a52c4', '#6b2a8f', '#2f1049'], ['#c58be6', '#8e3bb8', '#4b1a6b']].map(([a, b, c], i) => (
          <radialGradient id={`gp${i}`} key={i} cx=".34" cy=".3" r=".85"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></radialGradient>
        ))}
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b5d055" /><stop offset="1" stopColor="#4f7a26" /></linearGradient>
      </defs>
      <path d="M100 66C99 52 104 40 114 30" stroke="#6b4a2a" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M112 34c-4-14 4-26 22-26 4 14-4 24-22 26Z" fill="url(#leaf)" />
      <path d="M112 34c6-8 12-14 20-20" stroke="#3f6420" strokeWidth="1.4" fill="none" />
      <path d="M104 46C90 28 70 26 56 34c6 16 24 22 48 12Z" fill="url(#leaf)" />
      <path d="M102 44C88 36 76 34 62 36" stroke="#3f6420" strokeWidth="1.4" fill="none" />
      <path d="M100 52c-12 2-16 12-10 22" stroke="#86a93c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {berries.map((b, i) => (
        <g key={i} className="berry" style={{ '--dx': `${b.dx}px`, '--dy': `${b.dy}px`, '--d': `${b.d}s` }}>
          <circle cx={b.x} cy={b.y} r="15.5" fill={`url(#gp${b.k})`} />
          <ellipse cx={b.x - 5} cy={b.y - 6} rx="4.6" ry="2.8" transform={`rotate(-35 ${b.x - 5} ${b.y - 6})`} fill="#fff" opacity=".38" />
        </g>
      ))}
    </svg>
  )
}

function Intro({ guest, onDone }) {
  const [open, setOpen] = useState(false)
  const burstHearts = useMemo(() => Array.from({ length: LITE ? 14 : 24 }, () => ({
    dx: rand(-48, 48), dy: rand(-70, -20), rot: rand(-60, 60), s: rand(.7, 2.1), d: rand(0, .5), t: rand(1.8, 3.2),
  })), [])
  const start = () => {
    if (open) return
    setOpen(true); toggleMusic(true)
    setTimeout(onDone, CALM ? 300 : 2000)
  }
  return (
    <div className={`intro ${open ? 'is-open' : ''}`}>
      <div className="beam" />
      <div className="door door-l"><i className="ring" /></div>
      <div className="door door-r"><i className="ring" /></div>
      <div className="intro-content">
        <p className="intro-small">{guest ? `Hurmatli ${guest},` : 'Hurmatli mehmon,'}<br />sizga atalgan taklifnoma</p>
        <button className="uzum-btn" onClick={start} aria-label="Taklifnomani ochish">
          <Gul className="rosette" />
          <Grapes open={open} />
          <span className="burst" aria-hidden="true">
            {burstHearts.map((b, i) => (
              <Heart key={i} className="b-heart" style={{ '--dx': `${b.dx}vmin`, '--dy': `${b.dy}vmin`, '--r': `${b.rot}deg`, '--s': b.s, '--d': `${b.d}s`, '--t': `${b.t}s` }} />
            ))}
          </span>
        </button>
        <p className="intro-cta">{open ? 'Bismillah…' : 'Uzum boshini bosing — eshik ochiladi'}</p>
      </div>
    </div>
  )
}

/* ---------- Oltinsoy uzumzori: tog'lar, tokzor qatorlari, osilgan boshlar ---------- */
function Vineyard() {
  const bush = Array.from({ length: 27 }, (_, i) => i)
  const posts = Array.from({ length: 14 }, (_, i) => 20 + i * 92)
  const hang = [1, 3, 4, 6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 25]
  return (
    <svg className="skyline" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0 150L90 108 170 142 280 78 380 136 470 100 570 146 690 88 790 138 900 94 1010 140 1100 106 1200 146V240H0Z" fill="#2a1250" />
      <path d="M0 178Q150 140 300 172T600 165 900 170 1200 160V240H0Z" fill="#26204a" />
      <path d="M0 196Q200 172 420 190T820 184 1200 188V240H0Z" fill="#1d3322" />
      {posts.map((x) => <rect key={x} x={x} y="168" width="5" height="62" fill="#12081f" />)}
      <path d="M0 176H1200M0 196H1200" stroke="#12081f" strokeWidth="1.5" opacity=".7" />
      {bush.map((i) => <ellipse key={i} cx={i * 46 + 6} cy={200 + (i % 2) * 5} rx="24" ry="17" fill={i % 3 ? '#2f5a24' : '#3b6b2a'} />)}
      {hang.map((i) => {
        const x = i * 46 + 6
        return (
          <g key={i} fill={i % 2 ? '#7a2fa6' : '#5e2282'}>
            <circle cx={x - 5} cy="220" r="5.5" /><circle cx={x + 5} cy="220" r="5.5" />
            <circle cx={x - 8} cy="229" r="5.5" /><circle cx={x} cy="228" r="5.5" /><circle cx={x + 8} cy="229" r="5.5" />
            <circle cx={x - 3} cy="237" r="5.5" /><circle cx={x + 4} cy="237" r="5.5" />
          </g>
        )
      })}
      <path d="M0 240v-6h1200v6z" fill="#12081f" />
    </svg>
  )
}

const shadows = (n) => Array.from({ length: n }, () => `${rand(0, 100).toFixed(1)}vw ${rand(0, 62).toFixed(1)}vh #fff`).join(',')
const STAR_A = shadows(LITE ? 14 : 28), STAR_B = shadows(LITE ? 14 : 28), STAR_C = shadows(LITE ? 4 : 9)
const PETALS = Array.from({ length: LITE ? 5 : 9 }, (_, i) => ({ l: `${(i * 11 + rand(0, 8)).toFixed(0)}%`, s: rand(.8, 1.5), t: `${rand(14, 24).toFixed(1)}s`, d: `-${rand(0, 20).toFixed(1)}s`, c: ['#c9a0e6', '#8e3bb8', '#f1e9f7', '#E6B450', '#9dbb4a'][i % 4] }))
const LANTERNS = Array.from({ length: LITE ? 3 : 5 }, (_, i) => ({ l: 8 + i * (LITE ? 30 : 19) + ((i * 7) % 5), s: .7 + ((i * 3) % 5) * .18, d: i * 3.3, t: 26 + ((i * 5) % 9) }))
const METEORS = [{ t: '8%', l: '55%', d: '1s' }, { t: '16%', l: '20%', d: '6s' }, { t: '5%', l: '75%', d: '11s' }]
const GARLAND = Array.from({ length: LITE ? 6 : 9 }, (_, i) => ({ l: 5 + i * (LITE ? 17.5 : 11.2), h: 28 + ((i * 37) % 62), s: .8 + (i % 3) * .25, d: i * .4 }))

function Letters({ text }) {
  return <span aria-hidden="true">{[...text].map((c, i) => <span className="lt" key={i} style={{ '--i': i }}>{c}</span>)}</span>
}

function Countdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(0, WEDDING - now)
  const parts = [['kun', Math.floor(diff / 864e5)], ['soat', Math.floor(diff / 36e5) % 24], ['daqiqa', Math.floor(diff / 6e4) % 60], ['soniya', Math.floor(diff / 1e3) % 60]]
  if (diff === 0) return <p className="done">Bugun — bizning kunimiz! 🤍</p>
  return (
    <div className="count" role="timer" aria-label="To'ygacha qolgan vaqt">
      {parts.map(([l, v]) => <div key={l} className="count-cell"><b key={l === 'soniya' ? v : l} className={l === 'soniya' ? 'tick' : ''}>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}
    </div>
  )
}

const WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
function SaveDate() {
  return (
    <div className="cal" aria-label="Noyabr 2026, 22-sana belgilangan">
      <p className="cal-title">Noyabr 2026</p>
      <div className="cal-grid">
        {WEEK.map((d) => <span className="cal-h" key={d}>{d}</span>)}
        {Array.from({ length: 6 }, (_, i) => <span className="cal-gap" key={`g${i}`} />)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => d === 22
          ? <span className="cal-d on" key={d}><Heart /><b>22</b></span>
          : <span className="cal-d" key={d}>{d}</span>)}
      </div>
    </div>
  )
}

function addToCalendar() {
  const ev = (id, from, to, title) => ['BEGIN:VEVENT', `UID:nomozjon-mashxuraxon-${id}@wedding`, 'DTSTAMP:20261110T000000Z', `DTSTART:${from}`, `DTEND:${to}`,
    `SUMMARY:${title}`, "LOCATION:Oltinsoy tumani\\, \"Botosh\" MFY\\, Botosh ko'chasi 4-uy", 'END:VEVENT']
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nomozjon-Mashxuraxon//UZ',
    ...ev('osh', '20261122T040000Z', '20261122T070000Z', "Nomozjon & Mashxuraxon to'yi: ertalabki osh"),
    ...ev('bazm', '20261122T130000Z', '20261122T170000Z', "Nomozjon & Mashxuraxon to'yi: kechki bazm"),
    'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = 'nomozjon-mashxuraxon-toy.ics'; a.click()
}

/* ---------- Yevropacha elementlar: zaytun shoxi, gulchambar, konvert ---------- */
function Branch({ flip }) {
  const leaves = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg className={`branch ${flip ? 'flip' : ''}`} viewBox="0 0 200 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 22C60 8 140 8 198 20" />
      {leaves.map((i) => {
        const x = 18 + i * 19, y = 22 - Math.sin((i / 8) * Math.PI) * 11 + (i / 8) * -1
        return (
          <g key={i}>
            <ellipse cx={x} cy={y - 7} rx="9" ry="3.3" transform={`rotate(-32 ${x} ${y - 7})`} fill="currentColor" fillOpacity=".14" />
            <ellipse cx={x + 6} cy={y + 7} rx="9" ry="3.3" transform={`rotate(32 ${x + 6} ${y + 7})`} fill="currentColor" fillOpacity=".14" />
          </g>
        )
      })}
      <circle cx="196" cy="20" r="3" fill="currentColor" />
    </svg>
  )
}

function Wreath({ className = '' }) {
  const side = Array.from({ length: 9 }, (_, i) => 98 + i * 20)
  const pt = (t, r = 47) => [60 + r * Math.cos((t * Math.PI) / 180), 60 + r * Math.sin((t * Math.PI) / 180)]
  const [x1, y1] = pt(98), [x2, y2] = pt(258)
  const half = (
    <>
      <path d={`M${x1} ${y1}A47 47 0 0 1 ${x2} ${y2}`} />
      {side.map((t, i) => {
        const [x, y] = pt(t, i % 2 ? 41 : 53)
        return <ellipse key={t} cx={x} cy={y} rx="9" ry="3.4" transform={`rotate(${t + 90 + (i % 2 ? 28 : -28)} ${x} ${y})`} fill="currentColor" fillOpacity=".18" />
      })}
    </>
  )
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1">
      {half}<g transform="translate(120 0) scale(-1 1)">{half}</g>
    </svg>
  )
}

function Bunch({ x, y }) {
  return (
    <g fill="#8e3bb8" stroke="none">
      {[[-6, 0], [6, 0], [-10, 9], [0, 8], [10, 9], [-5, 17], [5, 17], [0, 25]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="5.2" fillOpacity={i % 2 ? .85 : 1} />)}
    </g>
  )
}

/* uzum ayvoni: ustunlar, tok shoxlari va osilgan boshlar */
function Facade() {
  const leaves = [[52, 36], [78, 28], [104, 24], [136, 24], [162, 28], [188, 36], [66, 33], [120, 22], [150, 26], [176, 32]]
  return (
    <svg className="facade" viewBox="0 0 240 120" aria-hidden="true" fill="none" stroke="#E6B450" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M28 112V38M212 112V38" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 38Q120 4 212 38" strokeWidth="3" />
      {leaves.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="6" transform={`rotate(${i % 2 ? 24 : -24} ${x} ${y})`} fill={i % 2 ? '#86a93c' : '#5f8a2c'} stroke="none" />)}
      <Bunch x={70} y={46} /><Bunch x={120} y={34} /><Bunch x={170} y={46} />
      <path d="M4 112H236" />
      <path d="M96 112V96Q96 84 120 84T144 96V112" fill="#E6B450" fillOpacity=".18" />
    </svg>
  )
}

const PROGRAM = [['09:00', 'Ertalabki osh'], ['18:00', 'Kechki bazm']]

function Letter({ note }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  // hech kim o'tkazib yubormasligi uchun: ko'rinib turgan bo'lsa o'zi ochiladi
  useEffect(() => {
    let t
    const io = new IntersectionObserver(([e]) => { clearTimeout(t); if (e.isIntersecting) t = setTimeout(() => setOpen(true), 2200) }, { threshold: .7 })
    io.observe(ref.current); return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  return (
    <div className="letter" ref={ref}>
      <div className={`envelope ${open ? 'open' : ''}`} onClick={() => setOpen(true)}>
        <div className="env-sheet"><span>Nomozjon &amp; Mashxuraxon</span></div>
        <div className="env-front" />
        <div className="env-flap"><i /><i /></div>
        <button className="seal" onClick={(e) => { e.stopPropagation(); setOpen(true) }} aria-label="Konvertni ochish" aria-expanded={open}><span>N<em>&amp;</em>M</span></button>
      </div>
      <p className={`env-hint ${open ? 'gone' : ''}`}>Mum muhrini bosing</p>
      <div className={`paper-wrap ${open ? 'show' : ''}`}>
        <div className="paper-clip">
          <div className="paper">
            <div className="sprigs"><Branch /><Heart className="sprig-heart" /><Branch flip /></div>
            <p className="to">{note}</p>
            <p className="lead">Assalomu alaykum! Sizni va oila a'zolaringizni aziz farzandlarimiz</p>
            <p className="body">Nomozjon va Mashxuraxonlarning nikoh to'yi munosabati bilan yoziladigan dasturxonimizga taklif etamiz. Tashrifingiz biz uchun eng katta sovg'a.</p>
            <Countdown />
            <SaveDate />
            <div className="prog">
              <p className="prog-title">Kun tartibi</p>
              <ol className="tl">
                {PROGRAM.map(([t, label]) => <li key={label}>{t && <b>{t}</b>}<span>{label}</span></li>)}
              </ol>
            </div>
            <div className="sprigs end"><Branch /><Heart className="sprig-heart" /><Branch flip /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Surxon: ikat naqshi va doira ---------- */
function Ikat({ className = '' }) {
  return (
    <svg className={`ikat ${className}`} aria-hidden="true" height="30">
      <defs>
        <pattern id="ik" width="44" height="30" patternUnits="userSpaceOnUse">
          <rect width="44" height="30" fill="#1e0f33" />
          <path d="M22 3 39 15 22 27 5 15Z" fill="#5e2282" stroke="#E6B450" strokeWidth="1.2" />
          <path d="M22 9 31 15 22 21 13 15Z" fill="#E6B450" />
          <circle cx="22" cy="15" r="2" fill="#8e3bb8" />
          <path d="M0 0H8L0 8ZM44 0H36L44 8ZM0 30H8L0 22ZM44 30H36L44 22Z" fill="#86a93c" />
        </pattern>
      </defs>
      <rect width="100%" height="30" fill="url(#ik)" />
    </svg>
  )
}

const RHYTHM = ['dum', 'tak', 'tak', 'dum', 'dum', 'tak', 'dum', 'tak', 'tak', 'dum', 'tak', 'dum']
function Doira() {
  const [hit, setHit] = useState({ n: 0, k: 'dum', x: 150, y: 150 })
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  const play = (k, x, y) => {
    drum(k); setHit((h) => ({ n: h.n + 1, k, x, y }))
    const r = ref.current?.getBoundingClientRect()
    if (r) burst(r.left + (x / 300) * r.width, r.top + (y / 300) * r.height, 'pop')
  }
  const tap = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 300, y = ((e.clientY - r.top) / r.height) * 300
    play(Math.hypot(x - 150, y - 150) < 80 ? 'dum' : 'tak', x, y)
  }
  const rhythm = () => {
    if (playing) return
    setPlaying(true)
    RHYTHM.forEach((k, i) => setTimeout(() => {
      const a = (i * Math.PI) / 6, d = k === 'dum' ? 0 : 100
      play(k, 150 + d * Math.cos(a), 150 + d * Math.sin(a))
    }, i * 240))
    setTimeout(() => { setPlaying(false); salute() }, RHYTHM.length * 240 + 200)
  }
  const jingles = Array.from({ length: 14 }, (_, i) => (i * 360) / 14)
  return (
    <>
      <div className="doira" ref={ref} onPointerDown={tap} role="button" tabIndex={0} aria-label="Doira: bosib chaling"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play('dum', 150, 150) } }}>
        <svg viewBox="0 0 300 300">
          <defs>
            <radialGradient id="wood" cx=".5" cy=".4" r=".7"><stop offset="0" stopColor="#8a5a2c" /><stop offset="1" stopColor="#3b2010" /></radialGradient>
            <radialGradient id="skin" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#f6ead3" /><stop offset="1" stopColor="#d9c4a0" /></radialGradient>
          </defs>
          <circle cx="150" cy="150" r="146" fill="url(#wood)" />
          <circle cx="150" cy="150" r="146" fill="none" stroke="#E6B450" strokeWidth="2" />
          <circle cx="150" cy="150" r="128" fill="url(#skin)" />
          <circle cx="150" cy="150" r="104" fill="none" stroke="#8e3bb8" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
          <circle cx="150" cy="150" r="82" fill="none" stroke="#5e2282" strokeWidth="1.5" />
          <g fill="none" stroke="#5e2282" strokeWidth="2.2" transform="translate(150 150)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => <path key={r} transform={`rotate(${r})`} d="M0-6C9-18 9-34 0-62-9-34-9-18 0-6Z" fill={r % 90 ? 'rgba(134,169,60,.35)' : 'rgba(142,59,184,.3)'} />)}
            <circle r="7" fill="#E6B450" stroke="#5e2282" />
          </g>
          <g key={hit.n} className={hit.n ? 'jingles shake' : 'jingles'}>
            {jingles.map((a) => (
              <g key={a} transform={`rotate(${a} 150 150)`}>
                <circle cx="150" cy="10" r="7.5" fill="#E6B450" stroke="#9a6f1f" strokeWidth="1.2" />
                <circle cx="150" cy="10" r="2.4" fill="#9a6f1f" />
              </g>
            ))}
          </g>
          {hit.n > 0 && <circle key={`r${hit.n}`} className={`ripple ${hit.k}`} cx={hit.x} cy={hit.y} r="22" />}
        </svg>
      </div>
      <button className="btn" onClick={rhythm} disabled={playing}>{playing ? 'Chalinmoqda…' : 'Surxon ritmini chalish'}</button>
    </>
  )
}

/* Havola oxiridagi so'z mehmon ismi bo'ladi: /Akmal, /Akmal_aka, /Akmal%20aka */
function guestFromPath() {
  try {
    const seg = decodeURIComponent(location.pathname.split('/').filter(Boolean)[0] || '')
    return seg.replace(/[-_+.]+/g, ' ').replace(/[^\p{L}\p{M}'’ʻ\s]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 40)
      .split(' ').map((w) => (w ? w[0].toLocaleUpperCase('uz') + w.slice(1) : w)).join(' ')
  } catch { return '' }
}

export default function App() {
  const guest = useMemo(guestFromPath, [])
  const [intro, setIntro] = useState(true)
  const [entered, setEntered] = useState(false)
  const [sound, setSound] = useState(true)
  const canvasRef = useRef(null)
  const heroFx = useRef(null)
  const heroRef = useRef(null)
  const moonRef = useRef(null)
  const fillRef = useRef(null)
  const needleRef = useRef(null)
  const spotRef = useRef(null)
  const floaters = useMemo(() => Array.from({ length: LITE ? 3 : 7 }, () => ({ x: rand(2, 98), s: rand(.5, 1.4), d: rand(0, 14), t: rand(12, 24) })), [])

  useEffect(() => { initFx(canvasRef.current, heroFx.current) }, [])
  useEffect(() => onMusicState(setSound), [])
  useEffect(() => { document.body.style.overflow = intro ? 'hidden' : '' }, [intro])

  // skroll: faqat kerakli elementlarga to'g'ridan-to'g'ri yoziladi (butun sahifani qayta hisoblamaydi)
  useEffect(() => {
    let r = 0
    const paint = () => {
      r = 0
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? y / max : 0
      if (moonRef.current && y < innerHeight * 1.3) moonRef.current.style.transform = `translate3d(0,${y * .3}px,0)`
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`
      if (needleRef.current) needleRef.current.style.transform = `translate3d(0,${p * innerHeight}px,0)`
    }
    const on = () => { if (!r) r = requestAnimationFrame(paint) }
    paint(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [intro])

  // hero ko'rinmay qolsa uning animatsiyalari to'xtaydi
  useEffect(() => {
    const h = heroRef.current
    const io = new IntersectionObserver(([en]) => h.classList.toggle('off', !en.isIntersecting))
    io.observe(h); return () => io.disconnect()
  }, [])

  // kursor ostidagi oltin yorug'lik (faqat sichqonchada, transform orqali)
  useEffect(() => {
    if (LITE) return
    const h = heroRef.current
    let r = 0, px = 0, py = 0
    const move = (e) => {
      const b = h.getBoundingClientRect(); px = e.clientX - b.left; py = e.clientY - b.top
      if (!r) r = requestAnimationFrame(() => { r = 0; if (spotRef.current) spotRef.current.style.transform = `translate3d(${px}px,${py}px,0)` })
    }
    h.addEventListener('pointermove', move)
    return () => h.removeEventListener('pointermove', move)
  }, [])

  // bosganda yuraklar, kursor izida oltin uchqunlar
  useEffect(() => {
    if (intro) return
    if (LITE) { const d = (e) => { if (!e.target.closest('input')) burst(e.clientX, e.clientY, 'pop') }; addEventListener('pointerdown', d); return () => removeEventListener('pointerdown', d) }
    let last = 0
    const down = (e) => { if (!e.target.closest('input')) burst(e.clientX, e.clientY, 'pop') }
    const move = (e) => {
      if (e.pointerType !== 'mouse' || e.timeStamp - last < 90) return
      last = e.timeStamp; burst(e.clientX, e.clientY, 'trail')
    }
    addEventListener('pointerdown', down); addEventListener('pointermove', move)
    return () => { removeEventListener('pointerdown', down); removeEventListener('pointermove', move) }
  }, [intro])

  const done = () => { setEntered(true); setTimeout(() => { setIntro(false); salute(); startAuto() }, 1300) }
  const note = guest ? `Hurmatli ${guest}!` : 'Hurmatli va qadrli mehmonimiz!'
  const marquee = Array.from({ length: 6 }, (_, i) => (
    <span className="mq-item" key={i}>Nomozjon <Heart /> Mashxuraxon <Gul className="mq-gul" /> 22 · 11 · 2026 <Heart /></span>
  ))

  return (
    <>
      <canvas ref={canvasRef} className="fx" aria-hidden="true" />
      {!intro && !CALM && (
        <div className="petals" aria-hidden="true">
          {PETALS.map((p, i) => <i key={i} className="petal" style={{ '--l': p.l, '--s': p.s, '--t': p.t, '--d': p.d, '--c': p.c }} />)}
        </div>
      )}
      {intro && <div className={entered ? 'fade-out' : ''}><Intro guest={guest} onDone={done} /></div>}

      {!intro && (
        <>
          <div className="thread" aria-hidden="true"><i ref={fillRef} /><span className="needle" ref={needleRef}><Heart /></span></div>
          <button className={`music ${sound ? '' : 'off'}`} onClick={() => setSound(toggleMusic())} aria-label={sound ? "Musiqani o'chirish" : 'Musiqani yoqish'}>♪</button>
        </>
      )}

      <main className={entered || !intro ? 'in' : ''}>
        <section className="hero" ref={heroRef}>
          <div className="aurora" aria-hidden="true" />
          <div className="stars" aria-hidden="true">
            <i className="sA" style={{ boxShadow: STAR_A }} /><i className="sB" style={{ boxShadow: STAR_B }} /><i className="sC" style={{ boxShadow: STAR_C }} />
          </div>
          {!LITE && <div className="spot" ref={spotRef} aria-hidden="true" />}
          <div className="moonwrap" ref={moonRef} aria-hidden="true"><svg className="moon" viewBox="0 0 120 120"><path d="M70 8a52 52 0 1 0 42 84A44 44 0 0 1 70 8Z" fill="#E6B450" /></svg></div>
          {METEORS.map((m, i) => <i key={i} className="meteor" style={{ '--t': m.t, '--l': m.l, '--d': m.d }} aria-hidden="true" />)}
          <div className="garland" aria-hidden="true">
            {GARLAND.map((g, i) => (
              <span key={i} className="string" style={{ left: `${g.l}%`, height: g.h, animationDelay: `-${g.d}s` }}>
                <Heart className="g-heart" style={{ width: 22 * g.s, color: i % 2 ? '#E6B450' : '#b26ad8' }} />
              </span>
            ))}
          </div>
          <div className="floaters" aria-hidden="true">
            {floaters.map((f, i) => <Heart key={i} className="floater" style={{ left: `${f.x}%`, '--s': f.s, animationDelay: `-${f.d}s`, animationDuration: `${f.t}s` }} />)}
          </div>
          <canvas ref={heroFx} className="hero-fx" aria-hidden="true" />
          <div className="lanterns" aria-hidden="true">
            {LANTERNS.map((f, i) => <i key={i} className="lantern" style={{ left: `${f.l}%`, '--s': f.s, animationDelay: `-${f.d}s, ${f.d % 2}s`, '--t': `${f.t}s` }} />)}
          </div>
          <Vineyard />
          <div className="hero-body">
            <p className="bism rise" style={{ '--d': '.1s' }}>Assalomu alaykum!</p>
            <h1 className="names" aria-label="Nomozjon va Mashxuraxon">
              <span className="n1"><Letters text="Nomozjon" /></span>
              <span className="rise hw" style={{ '--d': '.9s' }}><Heart className="n-heart" /></span>
              <span className="n2"><Letters text="Mashxuraxon" /></span>
            </h1>
            <p className="hero-date rise" style={{ '--d': '1.5s' }}>22 noyabr 2026 · yakshanba</p>
            <p className="hero-sub rise" style={{ '--d': '1.7s' }}>Oltinsoy uzumidek shirin, bir umrga atalgan muhabbat…</p>
            <a className="scroll rise" style={{ '--d': '2s' }} href="#taklif" aria-label="Pastga">↓</a>
          </div>
        </section>

        <div className="band" aria-hidden="true"><div className="mq"><div className="mq-track">{marquee}{marquee}</div></div></div>

        <section className="invite" id="taklif">
          <Letter note={note} />
        </section>

        <section className="venue">
          <div className="arch">
            <Facade />
            <p className="arch-label">To'y bo'ladigan manzil</p>
            <h2>Oltinsoy tumani</h2>
            <div className="sprigs arch-sprigs"><Branch /><Heart className="sprig-heart" /><Branch flip /></div>
            <div className="arch-info">
              <div><b>09:00</b><em>ertalabki osh</em></div>
              <div><b>18:00</b><em>kechki bazm</em></div>
            </div>
            <p className="arch-date">22 noyabr 2026, yakshanba</p>
            <p className="arch-where">
              <svg viewBox="0 0 40 52" aria-hidden="true"><path d="M20 50C8 34 3 27 3 19a17 17 0 0 1 34 0c0 8-5 15-17 31Z" fill="#8e3bb8" stroke="#E6B450" strokeWidth="2.5" /><circle cx="20" cy="19" r="6" fill="#f1e9f7" /></svg>
              “Botosh” MFY, Botosh ko'chasi, 4-uy
            </p>
            <div className="arch-btns">
              <a className="btn" href={MAP} target="_blank" rel="noreferrer">Xaritada ochish</a>
              <button className="btn ghost" onClick={addToCalendar}>Kalendarga qo'shish</button>
            </div>
            <p className="note">Xaritada aniq joylashuv ko'rsatilgan.</p>
          </div>
        </section>

        <section className="surxon">
          <Ikat className="top" />
          <Doira />
          <h2>Surxon to'yi doirasiz o'tmaydi</h2>
          <p className="surxon-sub">Doiraning o'rtasiga urilsa “dum”, chetiga urilsa “tak” bo'ladi. Chalib ko'ring.</p>
          <Ikat className="bottom" />
        </section>

        <section className="hosts">
          <Gul className="hosts-gul" />
          <p className="hosts-lead">Hurmat bilan,</p>
          <h2>Almanov Odil aka xonadoni</h2>
          <p className="hosts-sub">Sizni intizorlik bilan kutamiz.</p>
        </section>

        <footer>
          <div className="crest"><Wreath className="crest-wreath" /><span>N<em>&amp;</em>M</span></div>
          <p className="foot-names">Nomozjon &amp; Mashxuraxon</p>
          <p>Oltinsoy, 2026</p>
          <button className="salute" onClick={salute}><Heart /> Salyut qilish</button>
        </footer>
      </main>
    </>
  )
}
