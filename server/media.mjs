import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { githubRequest } from './admin.mjs';
export function decodeImage(data) {
  if (typeof data !== 'string' || data.length > 1100000 || !/^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(data)) throw new Error('Invalid image');
  const buffer = Buffer.from(data.split(',')[1], 'base64');
  if (buffer.length < 16 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Invalid WebP');
  return { buffer, src: `/uploads/${createHash('sha256').update(buffer).digest('hex')}.webp` };
}
function signature(asset) { return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(`${asset.src}:${asset.sha}`).digest('hex'); }
export function signAsset(asset) { return { ...asset, proof: signature(asset) }; }
export function validAsset(asset) {
  if (!asset || !/^\/uploads\/[a-f0-9]{64}\.webp$/.test(asset.src) || !/^[a-f0-9]{40}$/.test(asset.sha) || !/^[a-f0-9]{64}$/.test(asset.proof || '')) return false;
  return timingSafeEqual(Buffer.from(asset.proof, 'hex'), Buffer.from(signature(asset), 'hex'));
}
export async function commitImages(portfolio, sha, assets) {
  const branch = encodeURIComponent(process.env.GITHUB_BRANCH || 'main');
  const ref = await githubRequest(`git/ref/heads/${branch}`);
  const head = await githubRequest(`git/commits/${ref.object.sha}`);
  const file = await githubRequest(`contents/src/data/portfolio.js?ref=${ref.object.sha}`);
  if (file.sha !== sha) throw Object.assign(new Error('Portfolio changed. Reload the latest version before saving.'), { status: 409 });
  const content = `export const PORTFOLIO_DATA = ${JSON.stringify(portfolio, null, 2)};\n`;
  const blob = await githubRequest('git/blobs', 'POST', { content, encoding: 'utf-8' });
  const tree = await githubRequest('git/trees', 'POST', { base_tree: head.tree.sha, tree: [
    { path: 'src/data/portfolio.js', mode: '100644', type: 'blob', sha: blob.sha },
    ...Array.from(new Map(assets.map(asset => [asset.src, asset])).values()).map(asset => ({ path: `public${asset.src}`, mode: '100644', type: 'blob', sha: asset.sha })),
  ] });
  const commit = await githubRequest('git/commits', 'POST', { message: 'Update portfolio images and content from admin', tree: tree.sha, parents: [ref.object.sha] });
  await githubRequest(`git/refs/heads/${branch}`, 'PATCH', { sha: commit.sha, force: false });
  return { ok: true, sha: blob.sha, commitUrl: commit.html_url };
}
