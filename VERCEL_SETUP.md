# Admin setup on Vercel

Admin URL: https://portforlio-ngan.vercel.app/admin

In the Vercel project, open Settings > Environment Variables and add these for Production:

- ADMIN_PASSWORD: at least 4 characters (short PINs are supported at the owner's request; a long random password is safer). Share it privately with the portfolio owner.
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

## Photos and project artwork

In the editor, choose a personal portrait or add up to 12 images per project. JPG, PNG and WebP inputs up to 20 MB are resized to at most 1800px and converted to WebP in the browser. If the optimized image exceeds the upload limit, choose a smaller image. You can reorder images, set captions/alt text, select contain/cover, focal height, background color, corner radius and grid/stack layout. Original project covers and reference images are preserved. Uploaded project images are displayed as an additional gallery.

Preview uses the local draft. Save stages authenticated image blobs, then creates one Git commit containing the image files under public/uploads and src/data/portfolio.js. A signed receipt prevents substituting a different upload path or blob. The branch update is non-forced and rejects concurrent changes. No extra service or environment variables are required.

Removing an image removes it from the portfolio. Existing files are retained in Git history/storage so old versions remain recoverable. An interrupted save may leave unreferenced blobs but does not publish partial content. Keep the editor open on errors and retry. New image URLs become publicly available after the deployment finishes.
