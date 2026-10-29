import test from 'node:test';
import assert from 'node:assert/strict';
import { faviconSources } from '../src/favicon.js';

test('favicon tries the site first so a successful generic cache icon cannot mask it', () => {
  const sources = faviconSources(
    'https://example.com/private?q=secret#note',
    'chrome-extension://test/_favicon/',
  );
  assert.equal(sources.length, 2);
  const native = new URL(sources[1]);
  assert.equal(native.searchParams.get('pageUrl'), 'https://example.com/');
  assert.equal(native.searchParams.get('size'), '32');
  assert.equal(sources[0], 'https://example.com/favicon.ico');
});
test('preview favicons preserve origin ports without forwarding page paths', () => {
  assert.deepEqual(faviconSources('http://localhost:3000/path'), [
    'http://localhost:3000/favicon.ico',
  ]);
});
test('unsafe favicon destinations produce no image requests', () => {
  for (const url of [
    'javascript:alert(1)',
    'file:///secret',
    'https://user:pass@example.com',
    'not a url',
  ])
    assert.deepEqual(faviconSources(url), []);
});
