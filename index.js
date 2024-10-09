/**
 * mix-css-color
 * @version __VERSION__
 * @link http://github.com/noeldelgado/mix-css-color/
 * @license MIT
 */
import parse from 'parse-css-color';
import hsl2rgb from 'pure-color/convert/hsl2rgb';
import rgb2hex from 'pure-color/convert/rgb2hex';
import rgb2hsl from 'pure-color/convert/rgb2hsl';

function parseColor(color) {
  const res = parse(color);
  if (res === null) return null;
  if (res.type === 'hsl') res.values = hsl2rgb(res.values);
  return res;
}

// Constrains a value between a minimum and maximum value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Mix two colors together in variable proportion. Opacity is included in the calculations.
 * Copyright (c) 2006-2009 Hampton Catlin, Natalie Weizenbaum, and Chris Eppstein
 * http://sass-lang.com
 * @see https://github.com/less/less.js/blob/cae5021358a5fca932c32ed071f652403d07def8/lib/less/functions/color.js#L302
 */

export default function mix(color1, color2, percentage = 50) {
  // Check if we're mixing multiple colors
  if (Array.isArray(color1)) {
    return mixMultipleColors(color1, color2);
  }

  // Original two-color mixing logic
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  if (!c1 || !c2) return null;

  // Calculate weights and mix the colors based on the given percentage
  const p = clamp(percentage, 0, 100) / 100.0;
  const w = p * 2 - 1;
  const a = c1.alpha - c2.alpha;
  const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
  const w2 = 1 - w1;
  const [r, g, b] = c1.values.map((c, i) => Math.round(c1.values[i] * w1 + c2.values[i] * w2));
  const alpha = parseFloat((c1.alpha * p + c2.alpha * (1 - p)).toFixed(8));

  return {
    hex: rgb2hex([r, g, b]),
    hexa: rgb2hex([r, g, b, alpha]),
    rgba: [r, g, b, alpha],
    hsla: [...rgb2hsl([r, g, b]).map(Math.round), alpha]
  };
}

// Mixes multiple colors together based on given percentages
function mixMultipleColors(colors, percentages) {
  // Check if there are at least two colors to mix
  if (colors.length < 2) {
    return null;
  }

  // If percentages are not provided, distribute them evenly
  if (!Array.isArray(percentages)) {
    percentages = Array(colors.length).fill(100 / colors.length);
  }

  // Ensure the number of colors matches the number of percentages
  if (colors.length !== percentages.length) {
    return null;
  }

  // Parse all colors and check for invalid colors
  const parsedColors = colors.map(parseColor);
  if (parsedColors.includes(null)) {
    return null;
  }

  // Validate that percentages sum to 100 (within a small margin of error)
  const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    return null;
  }

  // Convert percentages to weights (0-1 range)
  const weights = percentages.map((p) => p / 100);

  // Initialize variables to store the mixed color components
  let r = 0,
    g = 0,
    b = 0,
    alpha = 0;

  // Mix the colors by applying weights to each component
  for (let i = 0; i < parsedColors.length; i++) {
    r += parsedColors[i].values[0] * weights[i];
    g += parsedColors[i].values[1] * weights[i];
    b += parsedColors[i].values[2] * weights[i];
    alpha += parsedColors[i].alpha * weights[i];
  }

  // Round RGB values to integers
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  // Limit alpha precision to 8 decimal places
  alpha = parseFloat(alpha.toFixed(8));

  // Return the mixed color in various formats
  return {
    hex: rgb2hex([r, g, b]),
    hexa: rgb2hex([r, g, b, alpha]),
    rgba: [r, g, b, alpha],
    hsla: [...rgb2hsl([r, g, b]).map(Math.round), alpha],
  };
}
