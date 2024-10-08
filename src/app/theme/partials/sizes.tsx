export const spaceDefaults = {
  s: 6, // faux border
  m: 12, // vertical padding between elements
  l: 18, // screen horizontal padding
  xl: 24, // spacing between components
  xxl: 36, // spacing above button
} as const;

export const fontSizes = {
  s: { fontSize: 12, lineHeight: 16 },
  m: { fontSize: 14, lineHeight: 20 },
  l: { fontSize: 18, lineHeight: 20 },
  xl: { fontSize: 24, lineHeight: 30 },
  xxl: { fontSize: 30, lineHeight: 36 },
  xxxl: { fontSize: 42, lineHeight: 48 },
} as const;
