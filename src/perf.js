// Telefon, kichik ekran yoki kuchsiz qurilmada effektlar yengillashtiriladi
export const LITE = matchMedia('(pointer: coarse)').matches || innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4
export const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches
