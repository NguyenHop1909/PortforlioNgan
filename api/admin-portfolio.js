import { authenticated, githubFile, send, validPortfolio } from '../server/admin.mjs';
export default async function handler(request, response) {
  if (!authenticated(request)) return send(response, 401, { error: 'Please sign in.' });
  if (request.method !== 'GET') return send(response, 405, { error: 'Method not allowed.' });
  try {
    const result = await githubFile();
    if (!result.ok) return send(response, 502, { error: 'Could not read the portfolio from GitHub. Check repository access.' });
    const file = await result.json();
    const source = Buffer.from(file.content, 'base64').toString('utf8');
    const json = source.replace(/^\s*export const PORTFOLIO_DATA\s*=\s*/, '').replace(/;\s*$/, '');
    const portfolio = JSON.parse(json);
    if (!validPortfolio(portfolio)) throw new Error('Invalid portfolio');
    return send(response, 200, { portfolio, sha: file.sha });
  } catch {
    return send(response, 502, { error: 'Could not load the latest portfolio. Check GitHub configuration and try again.' });
  }
}
