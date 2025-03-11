export function easeOut(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * t;
}

export function easeIn(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t;
}

export function easeInOut(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function elastic(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return (
    Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
  );
}

export function bounce(t: number): number {
  t = Math.max(0, Math.min(1, t));
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}

export function spring(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6);
}

export function backOut(t: number): number {
  t = Math.max(0, Math.min(1, t));
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function smoothStep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

export function anticipate(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * ((2 + 1) * t - 2);
}

export function overshoot(t: number): number {
  t = Math.max(0, Math.min(1, t));
  const c1 = 1.70158;
  return t * t * ((c1 + 1) * t - c1);
}
