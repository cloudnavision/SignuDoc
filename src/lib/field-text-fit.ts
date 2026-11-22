// Text inside a field box on the page scales with the box's size on screen,
// so a small box still shows its label or value instead of hiding it.

// An average character in the app's fonts, with a little room to spare.
const AVERAGE_CHARACTER_WIDTH_EM = 0.64;

/**
 * A CSS font size that fits text on one line inside an element with the
 * field-box class, never larger than maxPixels.
 */
export function fitFieldTextSize(text: string, maxPixels: number): string {
  const byWidth = 100 / (AVERAGE_CHARACTER_WIDTH_EM * Math.max(1, text.length));

  return `min(${String(maxPixels)}px, 70cqh, ${byWidth.toFixed(2)}cqw)`;
}
