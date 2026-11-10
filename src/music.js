// Fon musiqasi: /music.mp3 mayin ovozda, takrorlanib turadi
const VOL = 0.22
let audio, playing = false, fade = 0
const subs = new Set()
const emit = () => subs.forEach((f) => f(playing))

function el() {
  if (audio) return audio
  audio = new Audio('/music.mp3')
  audio.loop = true; audio.preload = 'auto'; audio.volume = 0
  audio.addEventListener('pause', () => { playing = false; emit() })
  audio.addEventListener('play', () => { playing = true; emit() })
  // tab yopilganda/telefon bloklanganda to'xtab, qaytganda davom etadi
  let resume = false
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { resume = playing; if (playing) audio.pause() }
    else if (resume) { resume = false; audio.play().catch(() => {}) }
  })
  return audio
}

function ramp(to, done) {
  clearInterval(fade)
  fade = setInterval(() => {
    const d = to - audio.volume
    if (Math.abs(d) < 0.01) { audio.volume = to; clearInterval(fade); done?.() }
    else audio.volume = Math.min(1, Math.max(0, audio.volume + Math.sign(d) * 0.01))
  }, 60)
}

export const onMusicState = (f) => { subs.add(f); return () => subs.delete(f) }
export function isPlaying() { return playing }
export function toggleMusic(force) {
  const a = el()
  const want = force ?? !playing
  if (want === playing) return playing
  if (want) { a.play().then(() => ramp(VOL)).catch(() => { playing = false; emit() }); playing = true }
  else { ramp(0, () => a.pause()); playing = false }
  emit()
  return playing
}
