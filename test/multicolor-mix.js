import tape from 'tape';
import mix from '..';

tape('multicolor mix', (t) => {
  const { deepEqual, equal, end } = t;

  equal(mix(['#ff0000'], [100]), null, 'single color input');

  deepEqual(
    mix(['#ff0000', '#00ff00', '#0000ff'], [33.33, 33.33, 33.34]),
    {
      rgba: [85, 85, 85, 1],
      hsla: [0, 0, 33, 1],
      hex: '#555555',
      hexa: '#555555ff'
    },
    'mix three colors equally'
  );

  deepEqual(
    mix(['#ff0000', '#00ff00', '#0000ff', '#ffff00'], [25, 25, 25, 25]),
    {
      rgba: [128, 128, 64, 1],
      hsla: [60, 33, 38, 1],
      hex: '#808040',
      hexa: '#808040ff'
    },
    'mix four colors equally'
  );

  equal(mix(['#ff0000', '#00ff00'], [60, 50]), null, 'invalid percentages (sum != 100)');

  const result = mix(['#ff0000', '#00ff00', '#0000ff'], [50, 30, 20]);
  t.equal(result.hex, '#804d33', 'mix three colors with custom percentages - hex');
  t.deepEqual(result.rgba.slice(0, 3), [128, 77, 51], 'mix three colors with custom percentages - rgb');
  t.equal(Math.abs(result.rgba[3] - 1) < 0.00001, true, 'mix three colors with custom percentages - alpha');
  t.equal(Math.abs(result.hsla[3] - 1) < 0.00001, true, 'mix three colors with custom percentages - alpha');

  end();
});