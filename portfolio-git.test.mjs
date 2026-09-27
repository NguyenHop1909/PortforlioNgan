import test from 'node:test';
import assert from 'node:assert/strict';
import { pushPortfolio } from './portfolio-git.mjs';
import publicSave from './api/save-portfolio.js';

function fakeGit({ dirty = true, branch = 'main', pushFails = false } = {}) {
  const calls = [];
  return { calls, run: async (_command, args) => {
    calls.push(args);
    if (args[0] === 'branch') return { stdout: branch };
    if (args[0] === 'remote') return { stdout: 'https://github.com/NguyenHop1909/PortforlioNgan.git' };
    if (args[0] === 'status') return { stdout: dirty ? ' M src/data/portfolio.js' : '' };
    if (args[0] === 'push' && pushFails) throw new Error('Push rejected');
    return { stdout: '' };
  } };
}
test('save commits only portfolio and pushes main without force', async () => {
  const git = fakeGit();
  await pushPortfolio('.', git.run);
  assert.deepEqual(git.calls.find(args => args[0] === 'commit'), ['commit', '--only', '-m', 'Update portfolio from local editor', '--', 'src/data/portfolio.js']);
  assert.deepEqual(git.calls.at(-1), ['push', 'origin', 'HEAD:refs/heads/main']);
});
test('retry pushes existing commit even without new file changes', async () => {
  const git = fakeGit({ dirty: false });
  await pushPortfolio('.', git.run);
  assert.equal(git.calls.some(args => args[0] === 'commit'), false);
  assert.equal(git.calls.at(-1)[0], 'push');
});
test('wrong branch prevents commit and push', async () => {
  const git = fakeGit({ branch: 'feature' });
  await assert.rejects(pushPortfolio('.', git.run), /Switch to main/);
  assert.equal(git.calls.length, 1);
});
test('push errors are propagated instead of reporting success', async () => {
  const git = fakeGit({ pushFails: true });
  await assert.rejects(pushPortfolio('.', git.run), /Push rejected/);
});
test('public save requires authentication', async () => {
  let status;
  await publicSave({ headers: {} }, { setHeader() {}, status(code) { status = code; return this; }, json(body) { assert.match(body.error, /Sign in/); } });
  assert.equal(status, 401);
});
