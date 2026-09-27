# Local editing and public deployment

Production is read-only: Edit buttons and editor are disabled. The public save API returns 403. No GitHub token is needed on Vercel.

Run `npm run dev -- --host 127.0.0.1` on your computer. Save writes `src/data/portfolio.js`, commits only that file, and pushes main to origin (NguyenHop1909/PortforlioNgan). Git must be signed in with write access. No force push is used.

If push fails, the file remains saved locally. Resolve the Git error in the terminal, then click Save to retry. Other modified or staged files are excluded from the editor commit. Push also sends existing unpushed commits on main.

Publish the application changes once to enable the read-only public build. If Vercel is connected to main, later successful saves trigger its configured deployment. Deployment completion is separate from push success.
