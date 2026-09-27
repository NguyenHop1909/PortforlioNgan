import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticated, sessionCookie, validPortfolio } from './server/admin.mjs';
import session from './api/admin-session.js';
import save from './api/save-portfolio.js';
import read from './api/admin-portfolio.js';
import { PORTFOLIO_DATA } from './src/data/portfolio.js';

process.env.ADMIN_PASSWORD = 'test-only-password-not-for-production';
process.env.ADMIN_SESSION_SECRET = 'test-only-session-secret-not-for-production';
process.env.GITHUB_TOKEN = 'fake-test-token';
const origin = 'https://portfolio.example';
function request(body, method = 'POST', cookie = sessionCookie().split(';')[0]) {
  return { method, body, headers: { host: 'portfolio.example', origin, cookie, 'content-type': 'application/json' } };
}
async function call(handler, req) {
  const result = { headers: {} };
  await handler(req, { setHeader(key, value) { result.headers[key] = value; }, status(code) { result.status = code; return this; }, json(body) { result.body = body; } });
  return result;
}
test('signed session rejects tampering, expiry and rotated credentials', () => {
  const now = Date.now();
  const req = request(null, 'GET', sessionCookie(now).split(';')[0]);
  assert.equal(authenticated(req, now), true);
  assert.equal(authenticated(req, now + 28800001), false);
  const tampered = structuredClone(req);
  tampered.headers.cookie += 'x';
  assert.equal(authenticated(tampered, now), false);
  const old = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD += '-rotated';
  assert.equal(authenticated(req, now), false);
  process.env.ADMIN_PASSWORD = old;
});
test('login, wrong password, same-origin enforcement and logout', async () => {
  const bad = await call(session, request({ password: 'wrong' }));
  assert.equal(bad.status, 401);
  const good = await call(session, request({ password: process.env.ADMIN_PASSWORD }));
  assert.equal(good.status, 200);
  assert.match(good.headers['Set-Cookie'], /HttpOnly; Secure; SameSite=Strict/);
  const cross = request({ password: process.env.ADMIN_PASSWORD }); cross.headers.origin = 'https://evil.example';
  assert.equal((await call(session, cross)).status, 403);
  assert.match((await call(session, request(null, 'DELETE'))).headers['Set-Cookie'], /Max-Age=0/);
});
test('read and save deny unauthenticated callers before contacting GitHub', async () => {
  assert.equal((await call(read, request(null, 'GET', ''))).status, 401);
  assert.equal((await call(save, request({}, 'POST', ''))).status, 401);
});
test('portfolio schema rejects unsafe links and broken arrays', () => {
  assert.equal(validPortfolio(PORTFOLIO_DATA), true);
  const invalid = structuredClone(PORTFOLIO_DATA);
  invalid.projects[0].links[0].url = 'javascript:alert(1)';
  assert.equal(validPortfolio(invalid), false);
  assert.equal(validPortfolio({}), false);
});
test('save validates origin, schema, size and GitHub revision conflicts', async t => {
  const body = { portfolio: PORTFOLIO_DATA, sha: 'a'.repeat(40) };
  const cross = request(body); cross.headers.origin = 'https://evil.example';
  assert.equal((await call(save, cross)).status, 403);
  assert.equal((await call(save, request({}))).status, 400);
  assert.equal((await call(save, request('x'.repeat(1024 * 1024 + 1)))).status, 400);
  t.mock.method(globalThis, 'fetch', async () => ({ status: 409, ok: false }));
  assert.equal((await call(save, request(body))).status, 409);
});
test('authenticated read and save preserve Vietnamese and file revision', async t => {
  const portfolio = structuredClone(PORTFOLIO_DATA);
  portfolio.personalInfo.name = 'Nguyễn Phúc Xuân Ngân';
  const sha = 'b'.repeat(40);
  let put;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    if (options.method === 'GET') return { ok: true, json: async () => ({ content: Buffer.from(`export const PORTFOLIO_DATA = ${JSON.stringify(portfolio)};\n`).toString('base64'), sha }) };
    put = JSON.parse(options.body);
    return { ok: true, json: async () => ({ content: { sha: 'c'.repeat(40) }, commit: { html_url: 'https://github.com/example/commit/test' } }) };
  });
  assert.deepEqual((await call(read, request(null, 'GET'))).body, { portfolio, sha });
  const result = await call(save, request({ portfolio, sha }));
  assert.equal(result.status, 200);
  assert.equal(result.body.sha, 'c'.repeat(40));
  assert.equal(put.sha, sha);
  assert.equal(put.branch, 'main');
  assert.match(Buffer.from(put.content, 'base64').toString(), /Nguyễn Phúc Xuân Ngân/);
});
