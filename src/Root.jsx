import { lazy, Suspense } from 'react';
import App from './App';
const Admin = lazy(() => import('./Admin'));
export default function Root() {
  return <Suspense fallback={<p>Đang tải…</p>}>
    {/^\/admin\/?$/.test(window.location.pathname) ? <Admin /> : <App />}
  </Suspense>;
}
