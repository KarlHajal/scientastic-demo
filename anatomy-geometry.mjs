import { vowelSettings } from './model.mjs';
import { tongueReference } from './anatomy-shapes.mjs';
export { headContour } from './anatomy-shapes.mjs';

export const tongueBounds = { left: 177, top: 222, width: 35, height: 21 };
const expandedTongueBounds = { left: 171, top: 218, width: 48, height: 30 };

/** Return an SVG path from the shared drawing coordinates. */
export function pathData(commands) {
  return commands.map(([command, ...points]) => command + points.join(' ')).join(' ');
}

function surfaceLimits(front, bounds = tongueBounds) {
  return { top: bounds.top + 3 * (front - .5) ** 2, bottom: bounds.top + bounds.height };
}

/** Project a pointer into the oral control region, including movement limits. */
export function tongueSettingsAt(x, y, limited = false) {
  const bounds = expandedTongueBounds;
  const { x: front } = vowelSettings((x - bounds.left) / bounds.width, 0, limited);
  const { top, bottom } = surfaceLimits(front, bounds);
  const { y: height } = vowelSettings(front, (bottom - y) / (bottom - top), limited);
  return { front, height };
}

/** Deform the attached tongue; use the larger pointer map for interactive views. */
export function tongueGeometry(settings, { interactive = false } = {}) {
  const { x: front, y: height } = vowelSettings(settings.front, settings.height, settings.limited);
  const bounds = interactive ? expandedTongueBounds : tongueBounds;
  const x = bounds.left + front * bounds.width;
  const { top, bottom } = surfaceLimits(front, bounds);
  const y = bottom - height * (bottom - top);
  const commands = tongueReference.map(([command, ...points]) => [command, ...points.map((value, i) => {
    const px = points[i-i%2], py = points[i-i%2+1];
    // The anterior tip and floor stay attached; the dorsum moves below the palate.
    const weight = Math.max(0, Math.min(1, (280-py)/48)) * Math.max(0, Math.min(1, (235-px)/24));
    const jawClearance = Math.max(0, Math.min(1, (px-224)/8)) * Math.max(0, Math.min(1, (py-268)/8));
    const vertical = -(height-.6)*20;
    return value + (i%2 === 0 ? (front-.5)*14*weight - 7*jawClearance : vertical*weight);
  })]);
  return { x, y, surfaceY:y, commands, path:pathData(commands) };
}

/** Return a slowed sagittal fold profile inside the source larynx. */
export function vocalFoldPath(displacement = 0) {
  return `M151 340Q161 ${338+displacement} 173 335L172 338Q161 ${342+displacement} 152 343Z`;
}

/** Return the controller's reachable region for each movement setting. */
export function tongueControlRegion(limited = false, { interactive = true } = {}) {
  const lo = limited ? .3 : 0, hi = limited ? .7 : 1;
  const points = [];
  for (let i=0;i<=20;i++) points.push(tongueGeometry({front:lo+(hi-lo)*i/20,height:hi,limited},{interactive}));
  for (let i=20;i>=0;i--) points.push(tongueGeometry({front:lo+(hi-lo)*i/20,height:lo,limited},{interactive}));
  return points.map(({x,y},i)=>`${i?'L':'M'}${x} ${y}`).join('')+'Z';
}
