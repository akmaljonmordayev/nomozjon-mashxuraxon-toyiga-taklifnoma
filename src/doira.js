// Doira ovozi: tayyor audio fayl kerak emas, Web Audio'da sintez qilinadi
let ctx, noise
const ac = () => {
  ctx ||= new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}
const noiseBuf = (c) => {
  if (noise) return noise
  noise = c.createBuffer(1, c.sampleRate * .2, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return noise
}

/** 'dum' — markazga urilgan past zarb, 'tak' — chetga urilgan o'tkir zarb va uzuk jarangi */
export function drum(kind) {
  try {
    const c = ac(), t = c.currentTime
    if (kind === 'dum') {
      const o = c.createOscillator(), g = c.createGain()
      o.type = 'sine'; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(68, t + .2)
      g.gain.setValueAtTime(.95, t); g.gain.exponentialRampToValueAtTime(.001, t + .42)
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + .45)
      return
    }
    const n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain()
    n.buffer = noiseBuf(c); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.1
    g.gain.setValueAtTime(.8, t); g.gain.exponentialRampToValueAtTime(.001, t + .12)
    n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .15)
    ;[4200, 5600, 6900].forEach((hz, i) => {
      const o = c.createOscillator(), j = c.createGain()
      o.type = 'triangle'; o.frequency.value = hz
      j.gain.setValueAtTime(.07, t + i * .012); j.gain.exponentialRampToValueAtTime(.001, t + .28)
      o.connect(j).connect(c.destination); o.start(t); o.stop(t + .3)
    })
  } catch { /* ovoz ishlamasa ham sahifa ishlayveradi */ }
}
