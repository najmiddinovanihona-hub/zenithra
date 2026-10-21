import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeEntry, mergeProgress } from '../server/progress.js';

test('mergeEntry: yangirog\'i (d) ustun, eng yaxshi ball saqlanadi', () => {
  assert.deepEqual(mergeEntry({ v: 1, s: 5, t: 5, b: 5, d: 1 }, { v: 1, s: 2, t: 5, b: 2, d: 2 }), { v: 1, s: 2, t: 5, b: 5, d: 2 });
  assert.deepEqual(mergeEntry({ v: 1, s: 2, t: 5, b: 2, d: 2 }, { v: 1, s: 5, t: 5, b: 5, d: 1 }), { v: 1, s: 2, t: 5, b: 5, d: 2 });
});

test('mergeEntry: o\'qilgan belgisi yo\'qolmaydi', () => {
  assert.equal(mergeEntry({ v: 1 }, {}).v, 1);
  assert.equal(mergeEntry({}, { v: 1 }).v, 1);
  assert.deepEqual(mergeEntry({ v: 1 }, { v: 1 }), { v: 1 });
});

test('mergeProgress: ikkala tomondagi mavzular birlashadi', () => {
  assert.deepEqual(Object.keys(mergeProgress({ t01: { v: 1 } }, { t02: { v: 1 } })).sort(), ['t01', 't02']);
});
