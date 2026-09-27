# Admin setup on Vercel

Admin URL: https://portforlio-ngan.vercel.app/admin

In the Vercel project, open Settings > Environment Variables and add these for Production:

- ADMIN_PASSWORD: a randomly generated password of at least 16 characters. Share it privately with the portfolio owner.
- ADMIN_SESSION_SECRET: a different random string of at least 32 characters, used to sign session cookies. Do not share it with the editor.
- GITHUB_TOKEN: a fine-grained GitHub token restricted to NguyenHop1909/PortforlioNgan with Contents: Read and write.

Optional: GITHUB_REPOSITORY=NguyenHop1909/PortforlioNgan and GITHUB_BRANCH=main (these are already the defaults).
Never use VITE_ prefixes for secrets. Redeploy after adding or changing variables. Enable Preview variables only if admin access is needed on previews.

The editor signs in at /admin, opens the portfolio, changes fields and clicks Save changes. The API reads the latest GitHub revision and commits only src/data/portfolio.js. Connected Vercel Git deployments publish that commit. A successful save confirms the GitHub commit, not deployment completion.

Visitors see no Edit button. Every remote read/write requires a signed HttpOnly, Secure, SameSite=Strict cookie (8-hour session); writes also require a same-origin request. Changing ADMIN_PASSWORD or ADMIN_SESSION_SECRET invalidates existing sessions. Logout clears the browser cookie. Login cooldown is best-effort per running function instance, not a global distributed rate limit; use a randomly generated password and optionally Vercel Firewall rate limiting for /api/admin-session.

Concurrent edits are rejected via the GitHub file SHA instead of overwriting newer changes. On a conflict, copy unsaved text, refresh and reopen the latest version. If GitHub times out, inspect the repository before retrying.

npm run dev retains the existing local editor. The deployed /admin flow requires Vercel Functions and HTTPS. Do not enter production credentials on a plain Vite dev server.

References:
- https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- https://vercel.com/docs/environment-variables
