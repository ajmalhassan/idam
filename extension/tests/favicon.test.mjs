import test from 'node:test';
import assert from 'node:assert/strict';
import * as favicons from '../src/favicon.js';

test('public sites get general lookup fallbacks without leaking paths or queries', () => {
  for (const host of ['mail.google.com', 'calendar.google.com', 'example.com']) {
    const sources = favicons.faviconSources(
      `https://${host}/private?q=secret#note`,
      'chrome-extension://test/_favicon/',
    );
    assert.deepEqual(sources.slice(0, 3), [
      `https://${host}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain_url=https%3A%2F%2F${host}%2F&sz=64`,
      `https://a.favicon.im/${host}?larger=true&throw-error-on-404=true`,
    ]);
    const native = new URL(sources[3]);
    assert.equal(native.searchParams.get('pageUrl'), `https://${host}/`);
    assert.ok(sources.every((source) => !source.includes('secret')));
  }
});

test('local and IP addresses never go to external lookup services', () => {
  for (const origin of [
    'http://localhost:3000',
    'http://printer',
    'http://nas.local',
    'http://home.arpa',
    'http://router.lan',
    'http://10.0.0.1',
    'http://127.0.0.1',
    'http://192.168.1.1',
    'http://172.16.0.1',
    'https://8.8.8.8',
    'http://[::1]',
    'http://[fd00::1]',
  ]) {
    assert.deepEqual(favicons.faviconSources(`${origin}/path`), [`${origin}/favicon.ico`]);
  }
});

test('unsafe favicon destinations produce no image requests', () => {
  for (const url of [
    'javascript:alert(1)',
    'file:///secret',
    'https://user:pass@example.com',
    'not a url',
  ]) {
    assert.deepEqual(favicons.faviconSources(url), []);
  }
});

test('failed direct icons fall through to a general lookup and share in-flight work', async () => {
  assert.equal(typeof favicons.createFaviconResolver, 'function');
  let calls = 0;
  const resolve = favicons.createFaviconResolver({
    load: async (source) => {
      calls++;
      if (source.includes('/favicon.ico')) throw new Error('not an icon');
    },
  });
  const [a, b] = await Promise.all([
    resolve('https://example.com/a'),
    resolve('https://example.com/b'),
  ]);
  assert.equal(
    a,
    'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fexample.com%2F&sz=64',
  );
  assert.equal(b, a);
  assert.equal(calls, 2);
  assert.equal(await resolve('https://example.com/c'), a);
  assert.equal(calls, 2);
});

test('a stalled source cannot prevent later sources from resolving', async () => {
  assert.equal(typeof favicons.createFaviconResolver, 'function');
  const resolve = favicons.createFaviconResolver({
    timeout: 5,
    load: (source) => (source.includes('/favicon.ico') ? new Promise(() => {}) : Promise.resolve()),
  });
  assert.equal(
    await resolve('https://example.com'),
    'https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fexample.com%2F&sz=64',
  );
});

test('total failure returns initials state, retries after expiry, and does not request invalid URLs', async () => {
  assert.equal(typeof favicons.createFaviconResolver, 'function');
  let time = 0;
  let fail = true;
  let calls = 0;
  const resolve = favicons.createFaviconResolver({
    now: () => time,
    load: async () => {
      calls++;
      if (fail) throw new Error('offline');
    },
  });
  assert.equal(await resolve('javascript:alert(1)'), null);
  assert.equal(calls, 0);
  assert.equal(await resolve('https://example.com'), null);
  assert.equal(calls, 3);
  fail = false;
  assert.equal(await resolve('https://example.com'), null);
  time = 61_000;
  assert.equal(await resolve('https://example.com'), 'https://example.com/favicon.ico');
});
