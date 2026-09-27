import { writeFile, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pushPortfolio } from './portfolio-git.mjs';

export function localPortfolioSave() {
  return {
    name: 'local-portfolio-save',
    apply: 'serve',
    configureServer(server) {
      const target = resolve(server.config.root, 'src/data/portfolio.js');
      let saving = false;
      server.middlewares.use('/api/local-save-portfolio', async (request, response) => {
        const send = (status, body) => {
          response.writeHead(status, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(body));
        };
        if (request.method !== 'POST') return send(405, { error: 'Use POST to save.' });
        const origin = request.headers.origin;
        const address = request.socket?.remoteAddress;
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) {
          return send(403, { error: 'Editing is available only on this computer.' });
        }
        if (!origin || (origin !== `http://${request.headers.host}` && origin !== `https://${request.headers.host}`)) {
          return send(403, { error: 'Save must come from this website.' });
        }
        if (!request.headers['content-type']?.startsWith('application/json')) {
          return send(415, { error: 'Expected JSON data.' });
        }
        if (saving) return send(409, { error: 'A save is already in progress. Please try again.' });
        saving = true;
        const temporary = `${target}.tmp`;
        try {
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 1024 * 1024) return send(413, { error: 'Portfolio data is too large.' });
            chunks.push(chunk);
          }
          let portfolio;
          try { portfolio = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
          catch { return send(400, { error: 'Invalid JSON data.' }); }
          if (!portfolio?.personalInfo || !Array.isArray(portfolio.projects) || !Array.isArray(portfolio.services)) {
            return send(400, { error: 'Portfolio data is missing required fields.' });
          }
          await writeFile(temporary, `export const PORTFOLIO_DATA = ${JSON.stringify(portfolio, null, 2)};\n`, 'utf8');
          await rename(temporary, target);
          try {
            await pushPortfolio(server.config.root);
          } catch (error) {
            server.config.logger.error(`Portfolio push failed: ${error.message}`);
            return send(502, { savedLocally: true, error: 'Saved to src/data/portfolio.js, but GitHub push failed. Check Git sign-in, branch main, and remote changes in the terminal, then click Save to retry.' });
          }
          send(200, { ok: true, file: 'src/data/portfolio.js' });
        } catch {
          send(500, { error: 'Could not write src/data/portfolio.js. Check file permissions and try again.' });
        } finally {
          await rm(temporary, { force: true }).catch(() => {});
          saving = false;
        }
      });
    },
  };
}
