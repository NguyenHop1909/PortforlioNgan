// Only authenticated admin sessions may write portfolio content.
import { authenticated, githubFile, parseBody, sameOrigin, send, validPortfolio } from '../server/admin.mjs';

export default async function handler(request, response) {
  if (!authenticated(request)) return send(response, 401, { error: 'Your session expired. Sign in again to save.' });
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' });
  if (!sameOrigin(request)) return send(response, 403, { error: 'Invalid request origin.' });
  let body;
  try { body = parseBody(request); } catch { return send(response, 400, { error: 'Invalid or oversized request.' }); }
  if (!validPortfolio(body?.portfolio) || !/^[a-f0-9]{40}$/.test(body?.sha || '')) {
    return send(response, 400, { error: 'Invalid portfolio data. Please check all fields and links.' });
  }
  try {
    const result = await githubFile('PUT', {
      message: 'Update portfolio from admin editor', sha: body.sha,
      content: Buffer.from(`export const PORTFOLIO_DATA = ${JSON.stringify(body.portfolio, null, 2)};\n`, 'utf8').toString('base64'),
    });
    if (result.status === 409 || result.status === 422) return send(response, 409, { error: 'The portfolio changed on GitHub. Keep a copy of your edits, then reload the latest version before saving.' });
    if (!result.ok) return send(response, 502, { error: 'GitHub could not save. Check the token has Contents: Read and write access to this repository.' });
    const saved = await result.json();
    return send(response, 200, { ok: true, sha: saved.content.sha, commitUrl: saved.commit.html_url });
  } catch {
    return send(response, 502, { error: 'Could not confirm the save. Check GitHub before retrying, and keep this editor open.' });
  }
}
