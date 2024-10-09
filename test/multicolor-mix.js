import tape from 'tape';
import mix from '..';

tape('multicolor mix', (t) => {
  const { equal, deepEqual, end } = t;

  // Tests mixMultipleColors function with a single color input, expecting null result
  equal(mix(['#ff0000'], [100]), null, 'single color input');

  // Tests mixMultipleColors function with three colors mixed equally
  const result1 = mix(['#ff0000', '#00ff00', '#0000ff'], [33.33, 33.33, 33.34]);
  equal(result1.hex, '#555555', 'mix three colors equally - hex');
  equal(result1.hexa, '#555555ff', 'mix three colors equally - hexa');
  deepEqual(result1.rgba, [85, 85, 85, 1], 'mix three colors equally - rgba');
  deepEqual(result1.hsla, [0, 0, 33, 1], 'mix three colors equally - hsla');

  // Tests mixMultipleColors function with four colors mixed equally
  const result2 = mix(['#ff0000', '#00ff00', '#0000ff', '#ffff00'], [25, 25, 25, 25]);
  equal(result2.hex, '#808040', 'mix four colors equally - hex');
  equal(result2.hexa, '#808040ff', 'mix four colors equally - hexa');
  deepEqual(result2.rgba, [128, 128, 64, 1], 'mix four colors equally - rgba');
  deepEqual(result2.hsla, [60, 33, 38, 1], 'mix four colors equally - hsla');

  // Tests mixMultipleColors function with invalid percentages, expecting null result
  equal(mix(['#ff0000', '#00ff00'], [60, 50]), null, 'invalid percentages (sum != 100)');

  // Tests mixMultipleColors function with three colors and custom percentages
  const result3 = mix(['#ff0000', '#00ff00', '#0000ff'], [50, 30, 20]);
  equal(result3.hex, '#804d33', 'mix three colors with custom percentages - hex');
  deepEqual(result3.rgba.slice(0, 3), [128, 77, 51], 'mix three colors with custom percentages - rgb');
  t.equal(Math.abs(result3.rgba[3] - 1) < 0.00001, true, 'mix three colors with custom percentages - rgba alpha');
  t.equal(Math.abs(result3.hsla[3] - 1) < 0.00001, true, 'mix three colors with custom percentages - hsla alpha');

  end();
});