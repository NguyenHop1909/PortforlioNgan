import { authenticated, githubRequest, parseBody, sameOrigin, send } from '../server/admin.mjs';
import { decodeImage, signAsset } from '../server/media.mjs';
export default async function handler(request, response) {
  if (!authenticated(request)) return send(response, 401, { error: 'Please sign in again.' });
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' });
  if (!sameOrigin(request)) return send(response, 403, { error: 'Invalid origin.' });
  let image;
  try { image = decodeImage(parseBody(request, 1200000).src); }
  catch { return send(response, 400, { error: 'Ảnh không hợp lệ hoặc quá lớn.' }); }
  try {
    const blob = await githubRequest('git/blobs', 'POST', { content: image.buffer.toString('base64'), encoding: 'base64' });
    return send(response, 200, signAsset({ src: image.src, sha: blob.sha }));
  } catch { return send(response, 502, { error: 'Không tải được ảnh. Hãy kiểm tra kết nối và quyền GitHub.' }); }
}
