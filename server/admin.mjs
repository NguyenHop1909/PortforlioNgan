import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
const COOKIE = '__Host-portfolio-admin';
const digest = value => createHash('sha256').update(value).digest();
export function configured() {
  return process.env.ADMIN_PASSWORD?.length >= 16 && process.env.ADMIN_SESSION_SECRET?.length >= 32;
}
export function sameOrigin(request) {
  try {
    const origin = new URL(request.headers.origin);
    return origin.protocol === 'https:' && origin.host === request.headers.host;
  } catch { return false; }
}
export function passwordMatches(password) {
  return configured() && typeof password === 'string' && password.length <= 1024 &&
    timingSafeEqual(digest(password), digest(process.env.ADMIN_PASSWORD));
}
function sign(value) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(`${process.env.ADMIN_PASSWORD}:${value}`).digest('base64url');
}
export function sessionCookie(now = Date.now()) {
  const value = `${now + 28800000}.${randomBytes(24).toString('base64url')}`;
  return `${COOKIE}=${value}.${sign(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`;
}
export function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
export function authenticated(request, now = Date.now()) {
  if (!configured()) return false;
  const token = (request.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token || token.length > 256) return false;
  const [expires, nonce, signature, extra] = token.split('.');
  if (extra || !nonce || !signature || !/^\d+$/.test(expires) || Number(expires) <= now || Number(expires) > now + 28800000) return false;
  return timingSafeEqual(digest(signature), digest(sign(`${expires}.${nonce}`)));
}
export function send(response, status, body) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  return response.status(status).json(body);
}
export function parseBody(request, max = 1024 * 1024) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw new Error('Expected JSON.');
  const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  if (Buffer.byteLength(body) > max) throw new Error('Request is too large.');
  return JSON.parse(body);
}
const strings = (obj, fields) => Boolean(obj && fields.every(field => typeof obj[field] === 'string'));
const stringList = value => Array.isArray(value) && value.every(item => typeof item === 'string');
const webLink = value => {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return value === ''; }
};
export function validPortfolio(value) {
  return Boolean(value) && strings(value.personalInfo, ['name', 'nickname', 'role', 'email', 'phone', 'linkedin', 'bio']) &&
    webLink(value.personalInfo.linkedin) && stringList(value.personalInfo.fields) &&
    Array.isArray(value.services) && value.services.length === 3 && value.services.every(service =>
      strings(service, ['title', 'icon', 'desc']) && stringList(service.tags)) &&
    Array.isArray(value.projects) && value.projects.length === 8 && value.projects.every(project =>
      (typeof project.id === 'string' || typeof project.id === 'number') &&
      strings(project, ['title', 'client', 'category', 'summary', 'role', 'results']) &&
      stringList(project.outcomes) && Array.isArray(project.links) && project.links.every(link =>
        strings(link, ['name', 'url']) && webLink(link.url)));
}
export async function githubFile(method = 'GET', body) {
  if (!process.env.GITHUB_TOKEN) throw new Error('GitHub saving has not been configured.');
  const repo = process.env.GITHUB_REPOSITORY || 'NguyenHop1909/PortforlioNgan';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const url = `https://api.github.com/repos/${repo}/contents/src/data/portfolio.js${method === 'GET' ? `?ref=${encodeURIComponent(branch)}` : ''}`;
  return fetch(url, {
    method, signal: AbortSignal.timeout(20000),
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify({ ...body, branch }) } : {}),
  });
}
