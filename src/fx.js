import { LITE, CALM } from './perf.js'

const HEART = new Path2D('M12 21.2C5 15.6 1.2 12 1.2 7.4 1.2 4 3.8 1.6 7 1.6c2 0 3.7 1 5 2.8 1.3-1.8 3-2.8 5-2.8 3.2 0 5.8 2.4 5.8 5.8 0 4.6-3.8 8.2-10.8 13.8Z')
const COLORS = ['#b26ad8', '#8e3bb8', '#c9a0e6', '#E6B450', '#f1e9f7']
const SETS = [['#c77dff', '#c9a0e6'], ['#E6B450', '#ffe08a'], ['#a6c94a', '#e3f5b0'], ['#f1e9f7', '#E6B450'], ['#b26ad8', '#E6B450']]
const KINDS = ['peony', 'heart', 'heart', 'ring', 'willow', 'hearts']
const F = LITE ? .55 : 1
const MAX = LITE ? 200 : 420
const rnd = (a, b) => a + Math.random() * (b - a)
const pick = (a) => a[Math.floor(Math.random() * a.length)]

class Stage {
  constructor(canvas, blend, dpr) {
    this.c = canvas; this.ctx = canvas.getContext('2d'); this.blend = blend; this.dpr = dpr
    this.parts = []; this.rockets = []; this.raf = 0; this.visible = true; this.last = 0
    this.size(); new ResizeObserver(() => this.size()).observe(canvas)
    new IntersectionObserver(([e]) => { this.visible = e.isIntersecting }).observe(canvas)
  }
  size() {
    this.w = this.c.clientWidth; this.h = this.c.clientHeight
    this.c.width = this.w * this.dpr; this.c.height = this.h * this.dpr; this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }
  wake() { if (!this.raf) this.raf = requestAnimationFrame((t) => this.tick(t)) }
  add(p) {
    if (this.parts.length > MAX) return
    this.parts.push({ life: 0, rot: rnd(-.6, .6), vr: rnd(-.08, .08), drag: .985, px: p.x, py: p.y, ...p }); this.wake()
  }
  rocket(x, y0, ty, kind) {
    if (this.rockets.length > 3) return
    this.rockets.push({ x, y: y0, vx: rnd(-.4, .4), vy: -Math.sqrt(2 * .11 * Math.max(60, y0 - ty)), kind, n: 0 }); this.wake()
  }
  explode(x, y, kind) {
    const set = pick(SETS)
    if (kind === 'heart') {
      const n = Math.round(48 * F)
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        const hx = 16 * Math.sin(t) ** 3, hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        this.add({ x, y, vx: hx * .36, vy: hy * .36, g: .012, drag: .955, s: 3.4, max: rnd(95, 120), c: set[i % 2], t: 'd' })
      }
      this.add({ x, y, vx: 0, vy: 0, g: 0, s: 30, max: 55, c: '#c77dff', t: 'h' })
    } else if (kind === 'hearts') {
      const n = Math.round(18 * F)
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, v = rnd(2, 3.6); this.add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .03, drag: .96, s: rnd(12, 20), max: rnd(80, 110), c: COLORS[i % 5], t: 'h' }) }
    } else {
      const n = Math.round((kind === 'ring' ? 40 : kind === 'willow' ? 38 : 56) * F)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd(-.04, .04)
        const v = kind === 'ring' ? 5.6 : kind === 'willow' ? rnd(2, 5.4) : rnd(4.6, 6.4)
        this.add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: kind === 'willow' ? .055 : .04, drag: kind === 'ring' ? .968 : .976, s: kind === 'willow' ? 2.6 : 3.4, max: kind === 'willow' ? rnd(110, 150) : rnd(70, 95), c: kind === 'willow' ? '#E6B450' : set[i % 2], t: 'd' })
      }
    }
  }

  tick(now) {
    // telefonda ~30 kadr/s: batareya va protsessorni asrash
    if (LITE && now - this.last < 32) { this.raf = requestAnimationFrame((t) => this.tick(t)); return }
    this.last = now
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.w, this.h)
    this.rockets = this.rockets.filter((r) => {
      r.vy += .11; r.x += r.vx; r.y += r.vy
      if (++r.n % (LITE ? 3 : 2) === 0) this.add({ x: r.x, y: r.y, vx: rnd(-.2, .2), vy: rnd(.2, .8), g: .02, s: 2, max: 16, c: '#ffd9a0', t: 'd' })
      if (r.vy > -.7) { this.explode(r.x, r.y, r.kind); return false }
      ctx.globalCompositeOperation = this.blend; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, 7); ctx.fill()
      return true
    })
    this.parts = this.parts.filter((p) => p.life < p.max)
    for (const p of this.parts) {
      p.life++; p.px = p.x; p.py = p.y; p.vy += p.g; p.vx *= p.drag; if (p.t === 'd') p.vy *= p.drag
      p.x += p.vx; p.y += p.vy; p.rot += p.vr
      const k = p.life / p.max
      ctx.globalAlpha = k < .12 ? k / .12 : Math.max(0, 1 - (k - .12) / .88)
      if (p.t === 'd') {
        ctx.globalCompositeOperation = this.blend; ctx.strokeStyle = p.c; ctx.lineWidth = p.s; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x + .01, p.y); ctx.stroke()
      } else {
        ctx.globalCompositeOperation = 'source-over'; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c
        if (p.t === 'h') { const s = p.s / 24; ctx.scale(s, s); ctx.translate(-12, -11); ctx.fill(HEART) }
        else { ctx.scale(p.s, p.s); ctx.beginPath(); ctx.moveTo(0, -1); ctx.quadraticCurveTo(0, 0, 1, 0); ctx.quadraticCurveTo(0, 0, 0, 1); ctx.quadraticCurveTo(0, 0, -1, 0); ctx.quadraticCurveTo(0, 0, 0, -1); ctx.fill() }
        ctx.restore()
      }
    }
    ctx.globalAlpha = 1
    // hech narsa qolmasa sikl to'xtaydi: bo'sh turganda protsessor ishlamaydi
    this.raf = (this.parts.length || this.rockets.length) ? requestAnimationFrame((t) => this.tick(t)) : 0
    if (!this.raf) ctx.clearRect(0, 0, this.w, this.h)
  }
}

let main, hero
export function initFx(overlay, heroCanvas) {
  main = new Stage(overlay, 'source-over', LITE ? 1 : 1.25)
  hero = new Stage(heroCanvas, 'lighter', 1)
}

export function burst(x, y, kind = 'pop') {
  if (!main || CALM) return
  if (kind === 'pop') for (let i = 0; i < Math.round(14 * F); i++) main.add({ x, y, vx: rnd(-3.2, 3.2), vy: rnd(-7, -2), g: .16, s: rnd(10, 24), max: rnd(55, 90), c: COLORS[i % 5], t: 'h' })
  if (kind === 'trail') main.add({ x, y, vx: rnd(-.4, .4), vy: rnd(.2, .8), g: .02, s: rnd(5, 10), max: 36, c: '#E6B450', t: 's' })
}

export function salute() {
  if (!main || CALM) return
  const n = LITE ? 4 : 7
  for (let i = 0; i < n; i++) setTimeout(() => main.rocket(rnd(.12, .88) * main.w, main.h, rnd(.12, .5) * main.h, i % 2 ? 'heart' : pick(KINDS)), i * 420)
}

/** Fonda o'zi otilib turadigan salyutlar (ko'rinib turgandagina) */
export function startAuto() {
  if (!main || CALM) return
  const every = (min, max, fn) => { const go = () => { if (!document.hidden) fn(); setTimeout(go, rnd(min, max)) }; setTimeout(go, 600) }
  every(LITE ? 1800 : 1100, LITE ? 3600 : 2400, () => {
    if (!hero.visible) return
    hero.rocket(rnd(.07, .93) * hero.w, hero.h * .8, rnd(.1, .45) * hero.h, pick(KINDS))
  })
  if (!LITE) every(4500, 8000, () => {
    if (scrollY < innerHeight * .6) return
    const left = Math.random() > .5
    main.rocket((left ? rnd(.04, .2) : rnd(.8, .96)) * main.w, main.h, rnd(.2, .5) * main.h, pick(KINDS))
  })
}
