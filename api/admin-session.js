import { authenticated, clearCookie, configured, parseBody, passwordMatches, sameOrigin, send, sessionCookie } from '../server/admin.mjs';
// Best-effort cooldown per function instance. Use a long randomly generated password.
const attempts = new Map();
export default async function handler(request, response) {
  if (!configured()) return send(response, 503, { error: 'Admin login has not been configured.' });
  if (request.method === 'GET') return send(response, 200, { authenticated: authenticated(request) });
  if (!['POST', 'DELETE'].includes(request.method)) return send(response, 405, { error: 'Method not allowed.' });
  if (!sameOrigin(request)) return send(response, 403, { error: 'Invalid request origin.' });
  if (request.method === 'DELETE') {
    response.setHeader('Set-Cookie', clearCookie());
    return send(response, 200, { ok: true });
  }
  const now = Date.now();
  for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
  const ip = request.headers['x-vercel-forwarded-for'] || request.socket?.remoteAddress || 'unknown';
  const previous = attempts.get(ip) || { count: 0, until: now + 900000 };
  if (previous.count >= 5) {
    response.setHeader('Retry-After', Math.ceil((previous.until - now) / 1000));
    return send(response, 429, { error: 'Too many attempts. Please try again in 15 minutes.' });
  }
  let body;
  try { body = parseBody(request, 4096); } catch { return send(response, 400, { error: 'Invalid login request.' }); }
  if (!passwordMatches(body?.password)) {
    if (attempts.size < 10000) attempts.set(ip, { ...previous, count: previous.count + 1 });
    return send(response, 401, { error: 'Incorrect password.' });
  }
  attempts.delete(ip);
  response.setHeader('Set-Cookie', sessionCookie());
  return send(response, 200, { ok: true });
}
