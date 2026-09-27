import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
export async function pushPortfolio(root, run = exec, imageFiles = []) {
  const git = async (...args) => (await run('git', args, {
    cwd: root, timeout: 60000, windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' },
  })).stdout.trim();
  if (await git('branch', '--show-current') !== 'main') {
    throw new Error('Switch to main before saving to GitHub.');
  }
  const remote = await git('remote', 'get-url', '--push', 'origin');
  if (!['https://github.com/NguyenHop1909/PortforlioNgan.git', 'git@github.com:NguyenHop1909/PortforlioNgan.git'].includes(remote)) {
    throw new Error('Origin must point to NguyenHop1909/PortforlioNgan.');
  }
  const file = 'src/data/portfolio.js';
  if (!imageFiles.every(path => /^public\/uploads\/[a-f0-9]{64}\.webp$/.test(path))) throw new Error('Invalid image path');
  const files = [file, ...new Set(imageFiles)];
  if (imageFiles.length) await git('add', '--', ...files.slice(1));
  if (await git('status', '--porcelain', '--', ...files)) {
    await git('commit', '--only', '-m', 'Update portfolio from local editor', '--', ...files);
  }
  // Also retries a previous commit whose push failed. Never force-push.
  await git('push', 'origin', 'HEAD:refs/heads/main');
}
