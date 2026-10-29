import test from 'node:test';
import assert from 'node:assert/strict';
import { greetingFor } from '../src/greeting.js';

test('local-time greetings keep overnight hours out of morning', () => {
  for (const [hour, minute, expected] of [
    [0, 0, 'good evening'],
    [0, 23, 'good evening'],
    [4, 59, 'good evening'],
    [5, 0, 'good morning'],
    [11, 59, 'good morning'],
    [12, 0, 'good afternoon'],
    [17, 59, 'good afternoon'],
    [18, 0, 'good evening'],
    [23, 59, 'good evening'],
  ]) {
    assert.equal(greetingFor(new Date(2026, 9, 30, hour, minute)), expected, `${hour}:${minute}`);
  }
});
