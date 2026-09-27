import { useEffect, useState } from 'react';
import { PortfolioEditor } from './App';

async function api(path, options) {
  const response = await fetch(path, { credentials: 'same-origin', ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || 'Không thể kết nối. Vui lòng thử lại.');
    error.status = response.status;
    throw error;
  }
  return body;
}
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);
  const [original, setOriginal] = useState(null);
  const [sha, setSha] = useState('');
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const [commitUrl, setCommitUrl] = useState('');
  useEffect(() => {
    document.title = 'Quản lý portfolio | XANA';
    api('/api/admin-session').then(result => setAuthenticated(result.authenticated))
      .catch(err => setError(err.message)).finally(() => setBusy(false));
  }, []);
  async function login(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/api/admin-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      setAuthenticated(true); setPassword('');
      if (draft) setEditing(true);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function openEditor() {
    if (draft) { setEditing(true); return; }
    setBusy(true); setError('');
    try {
      const result = await api('/api/admin-portfolio');
      setOriginal(result.portfolio); setDraft(structuredClone(result.portfolio)); setSha(result.sha);
      setEditing(true); setSaveState('idle');
    } catch (err) { setError(err.message); if (err.status === 401) setAuthenticated(false); }
    finally { setBusy(false); }
  }
  async function save() {
    setSaveState('saving'); setError('');
    try {
      const result = await api('/api/save-portfolio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portfolio: draft, sha }),
      });
      if (!result.ok || !result.sha) throw new Error('Chưa xác nhận được việc lưu. Vui lòng kiểm tra lại.');
      setSha(result.sha); setOriginal(structuredClone(draft)); setCommitUrl(result.commitUrl);
      setSaveState('success');
    } catch (err) {
      setError(err.message); setSaveState('error');
      if (err.status === 401) { setAuthenticated(false); setEditing(false); }
    }
  }
  async function logout() {
    setBusy(true); setError('');
    try {
      await api('/api/admin-session', { method: 'DELETE' });
      setAuthenticated(false); setDraft(null); setOriginal(null); setEditing(false); setCommitUrl('');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="admin-page">
    <section className="admin-card">
      <a className="wordmark" href="/">xana<span>✳</span></a>
      <span className="eyebrow">TRANG QUẢN LÝ RIÊNG</span>
      <h1>Chăm chút portfolio của bạn.</h1>
      {!authenticated ? <form onSubmit={login}>
        <p>Nhập mật khẩu để chỉnh sửa nội dung website.</p>
        <label>Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
        <button className="button" disabled={busy}>{busy ? 'Đang kiểm tra…' : 'Đăng nhập'}</button>
      </form> : <>
        <p>Chỉnh nội dung và lưu ngay tại đây. Bản cập nhật sẽ được gửi lên GitHub; website cần một chút thời gian để triển khai.</p>
        <div className="admin-buttons"><button className="button" onClick={openEditor} disabled={busy}>{busy ? 'Đang tải…' : 'Chỉnh sửa portfolio'}</button><button className="button secondary" onClick={logout} disabled={busy}>Đăng xuất</button></div>
        {commitUrl && <p role="status">Đã lưu thành công. <a href={commitUrl} target="_blank" rel="noreferrer">Xem bản lưu</a> · <a href="/" target="_blank" rel="noreferrer">Mở website</a></p>}
      </>}
      {error && !editing && <p className="admin-error" role="alert">{error}</p>}
      <a className="text-link" href="/">← Về portfolio</a>
    </section>
    {authenticated && editing && draft && <PortfolioEditor remote draft={draft} setDraft={value => { if (saveState !== 'saving') { setDraft(value); setSaveState('idle'); } }} onSave={save}
      onClose={() => { if (saveState !== 'saving') setEditing(false); }}
      onReset={() => { setDraft(structuredClone(original)); setSaveState('idle'); }} saveState={saveState} saveError={error} />}
  </main>;
}
