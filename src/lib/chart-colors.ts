/**
 * Palette de dataviz validée (8 teintes catégorielles, CVD-safe — voir la skill dataviz).
 * Ordre fixe, jamais recalculé par valeur : l'ordre est le mécanisme de sécurité CVD.
 */
export const CATEGORICAL_LIGHT = [
  '#2a78d6', // 1 blue
  '#1baf7a', // 2 aqua
  '#eda100', // 3 yellow
  '#008300', // 4 green
  '#4a3aa7', // 5 violet
  '#e34948', // 6 red
  '#e87ba4', // 7 magenta
  '#eb6834', // 8 orange
] as const

export const CATEGORICAL_DARK = [
  '#3987e5',
  '#199e70',
  '#c98500',
  '#008300',
  '#9085e9',
  '#e66767',
  '#d55181',
  '#d95926',
] as const

export const SEQUENTIAL_BLUE = {
  100: '#cde2fb',
  200: '#9ec5f4',
  300: '#6da7ec',
  400: '#3987e5',
  450: '#2a78d6',
  500: '#256abf',
  600: '#184f95',
  700: '#0d366b',
}

export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
}

export const CHART_INK = {
  secondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
}
