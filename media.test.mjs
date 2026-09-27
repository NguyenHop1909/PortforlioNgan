import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeImage, signAsset, validAsset, commitImages } from './server/media.mjs';
import { stageMedia } from './src/media.js';
import { validPortfolio } from './server/admin.mjs';
import upload from './api/admin-image.js';
import { PORTFOLIO_DATA } from './src/data/portfolio.js';
process.env.ADMIN_SESSION_SECRET = 'test-only-secret-at-least-32-characters';
process.env.GITHUB_TOKEN = 'fake-test-token';
const src = `/uploads/${'a'.repeat(64)}.webp`;
const image = { src, alt: 'Thiết kế', caption: 'Chú thích', fit: 'contain', position: 50, radius: 12, background: '#f5f3ee' };
test('image data rejects active formats, invalid bytes and oversized requests', () => {
  assert.throws(() => decodeImage('data:image/svg+xml;base64,PHN2Zz4='));
  assert.throws(() => decodeImage('data:image/webp;base64,YWJj'));
  assert.throws(() => decodeImage('x'.repeat(1100001)));
  const bytes = Buffer.from('RIFF1234WEBP1234');
  assert.match(decodeImage(`data:image/webp;base64,${bytes.toString('base64')}`).src, /^\/uploads\/[a-f0-9]{64}\.webp$/);
});
test('signed upload receipts cannot redirect writes or change blob hashes', () => {
  const asset = signAsset({ src, sha: 'b'.repeat(40) });
  assert.equal(validAsset(asset), true);
  assert.equal(validAsset({ ...asset, src: '/src/App.jsx' }), false);
  assert.equal(validAsset({ ...asset, sha: 'c'.repeat(40) }), false);
});
test('portfolio validates image paths, styles and gallery limits', () => {
  const portfolio = structuredClone(PORTFOLIO_DATA);
  portfolio.personalInfo.portrait = image;
  portfolio.projects[0].images = [image];
  portfolio.projects[0].galleryLayout = 'stack';
  assert.equal(validPortfolio(portfolio), true);
  portfolio.projects[0].images = Array(13).fill(image);
  assert.equal(validPortfolio(portfolio), false);
  portfolio.projects[0].images = [{ ...image, src: 'javascript:alert(1)' }];
  assert.equal(validPortfolio(portfolio), false);
});
test('staging processes only new images without mutating the visible draft', async () => {
  const draft = structuredClone(PORTFOLIO_DATA);
  draft.personalInfo.portrait = { ...image, src: 'data:image/webp;base64,test' };
  draft.projects[0].images = [image];
  let calls = 0;
  const prepared = await stageMedia(draft, async () => { calls++; return { src, sha: 'b'.repeat(40) }; });
  assert.equal(calls, 1);
  assert.equal(prepared.portfolio.personalInfo.portrait.src, src);
  assert.match(draft.personalInfo.portrait.src, /^data:/);
});
test('image uploads reject unauthenticated callers', async () => {
  let status;
  await upload({ headers: {}, method: 'POST' }, { setHeader() {}, status(value) { status = value; return this; }, json() {} });
  assert.equal(status, 401);
});
test('images and content publish through one non-forced atomic branch update', async t => {
  const calls = [];
  const replies = [{ object: { sha: 'head' } }, { tree: { sha: 'base-tree' } }, { sha: 'old-file' }, { sha: 'new-file' }, { sha: 'new-tree' }, { sha: 'new-commit', html_url: 'commit-url' }, {}];
  t.mock.method(globalThis, 'fetch', async (url, options) => { calls.push({ url, body: options.body && JSON.parse(options.body) }); return { ok: true, json: async () => replies.shift() }; });
  const result = await commitImages(PORTFOLIO_DATA, 'old-file', [{ src, sha: 'image-blob' }]);
  assert.equal(result.sha, 'new-file');
  assert.equal(calls[4].body.base_tree, 'base-tree');
  assert.equal(calls[4].body.tree[1].path, `public${src}`);
  assert.deepEqual(calls[5].body.parents, ['head']);
  assert.deepEqual(calls[6].body, { sha: 'new-commit', force: false });
});
test('stale draft is rejected before writing any new tree or commit', async t => {
  let calls = 0;
  const replies = [{ object: { sha: 'head' } }, { tree: { sha: 'base-tree' } }, { sha: 'newer-file' }];
  t.mock.method(globalThis, 'fetch', async () => { calls++; return { ok: true, json: async () => replies.shift() }; });
  await assert.rejects(commitImages(PORTFOLIO_DATA, 'old-file', []), error => error.status === 409);
  assert.equal(calls, 3);
});
