export function lightenDarkenColor(color: string, percent: number): string {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, parseInt((R * (100 + percent)) / 100)));
  G = Math.min(255, Math.max(0, parseInt((G * (100 + percent)) / 100)));
  B = Math.min(255, Math.max(0, parseInt((B * (100 + percent)) / 100)));

  const RR = R.toString(16).padStart(2, "0");
  const GG = G.toString(16).padStart(2, "0");
  const BB = B.toString(16).padStart(2, "0");

  return `#${RR}${GG}${BB}`;
}

export function invertColor(hex: string): string {
  return (
    "#" + (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase()
  );
}
