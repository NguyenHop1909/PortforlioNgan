import { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA as data } from './data/portfolio';
import { CANVA_PORTFOLIO_URL } from './data/projectsData';
import './App.css';
import ImageEditor from './ImageEditor';
import { imageStyle } from './media';

const filters = ['All projects', 'Brand writing', 'Video scripts', 'Social content'];
const STORAGE_KEY = 'xana-portfolio-content';
const LOCAL_FILE_SAVE = import.meta.env.DEV;
const work = [
  { image: 'mb.png', tags: [1, 3], format: 'PR & Brand storytelling', title: 'Small actions. A nationwide story.', brand: 'MB Bank', result: '3M+ digital engagements', color: 'blue' },
  { image: 'vgj.png', tags: [1, 3], format: 'Product launch · PR', title: 'A golden start to the new year.', brand: 'VietinBank Gold & Jewellery', result: '2025 collection launch', color: 'peach' },
  { image: 'ponnie.png', tags: [2, 3], format: 'Video scripts · KOL content', title: 'Friday nights, with a little Pönnie.', brand: 'PÖNNIE', result: 'Nearly 2.5M KOL content views', color: 'pink' },
  { image: 'namngu.png', tags: [2], format: 'Video scripts · Product launch', title: 'A taste of Phú Quốc, told together.', brand: 'Nam Ngư', result: '7M+ campaign views', color: 'yellow' },
  { image: 'oliv.png', tags: [2, 3], format: 'KOL scripts · Social activation', title: 'Making everyday care feel natural.', brand: 'Ôliv Natural Nourish', result: '800K+ engagements per launch', color: 'green' },
  { image: 'purite.png', tags: [2, 3], format: 'Creative concepts · KOL scripts', title: 'A little self-care. A lot of stories.', brand: 'Purité de Provence', result: '1M+ engagements per campaign', color: 'purple' },
  { image: 'monte.png', tags: [2, 3], format: 'Social content · Community', title: 'Little moments. Meaningful connections.', brand: 'Zott Monte', result: 'Full-year content campaign', color: 'blue' },
  { image: 'creative-desk.jpg', tags: [1, 2, 3], format: 'Employer branding · Social', title: 'The stories behind the creative team.', brand: 'THE A LIST', result: '50–80K additional monthly views', color: 'peach' },
];
function Arrow() { return <span aria-hidden="true">↗</span>; }

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function EditableText({ value, onChange, enabled, label }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && ref.current.textContent !== value) ref.current.textContent = value; }, [value, enabled]);
  if (!enabled) return <>{value}</>;
  return <span ref={ref} className="inline-editable" contentEditable="plaintext-only" suppressContentEditableWarning role="textbox" aria-label={label} aria-multiline="true" onInput={event => onChange(event.currentTarget.textContent)} />;
}

export function PortfolioEditor({ draft, setDraft, onSave, onClose, onReset, onPreview, saveState, saveError, saveProgress, remote = false }) {
  const [imageBusy, setImageBusy] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);
  const updatePersonal = (field, value) => setDraft(current => ({
    ...current,
    personalInfo: { ...current.personalInfo, [field]: value }
  }));
  const updateProject = (index, field, value) => setDraft(current => ({
    ...current,
    projects: current.projects.map((project, projectIndex) => projectIndex === index ? { ...project, [field]: value } : project)
  }));
  const updateService = (index, field, value) => setDraft(current => ({
    ...current,
    services: current.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, [field]: value } : service)
  }));
  const updateList = (index, field, value) => updateProject(index, field, value.split('\n').map(item => item.trim()).filter(Boolean));

  return (
    <dialog ref={dialogRef} className="editor-dialog" onCancel={event => { event.preventDefault(); if (!imageBusy) onClose(); }} aria-labelledby="editor-title">
      <div className="editor-header">
        <div><span className="eyebrow">WEBSITE EDITOR</span><h2 id="editor-title">Edit your portfolio</h2><p>{remote ? 'Chỉnh nội dung rồi bấm Save changes. Website sẽ cập nhật sau khi bản mới triển khai xong.' : 'Save changes writes src/data/portfolio.js and pushes your portfolio to GitHub.'}</p></div>
        <button className="icon-button" onClick={onClose} disabled={saveState === 'saving' || imageBusy} aria-label="Close editor">×</button>
      </div>
      <fieldset className="editor-body editor-content" disabled={saveState === 'saving' || imageBusy}>
        <section className="editor-section">
          <div className="editor-section-heading"><h3>Personal information</h3><span>About and contact</span></div>
          <ImageEditor portrait images={draft.personalInfo.portrait ? [draft.personalInfo.portrait] : []} onChange={images => updatePersonal('portrait', images[0] || null)} onBusy={setImageBusy} />
          <div className="editor-fields">
            <label>Display name<input value={draft.personalInfo.name} onChange={event => updatePersonal('name', event.target.value)} /></label>
            <label>Nickname<input value={draft.personalInfo.nickname} onChange={event => updatePersonal('nickname', event.target.value)} /></label>
            <label>Role<input value={draft.personalInfo.role} onChange={event => updatePersonal('role', event.target.value)} /></label>
            <label>Email<input type="email" value={draft.personalInfo.email} onChange={event => updatePersonal('email', event.target.value)} /></label>
            <label>Phone<input value={draft.personalInfo.phone} onChange={event => updatePersonal('phone', event.target.value)} /></label>
            <label>LinkedIn URL<input type="url" value={draft.personalInfo.linkedin} onChange={event => updatePersonal('linkedin', event.target.value)} /></label>
            <label className="field-wide">Bio<textarea rows="4" value={draft.personalInfo.bio} onChange={event => updatePersonal('bio', event.target.value)} /></label>
            <label className="field-wide">Fields, one per line<textarea rows="3" value={draft.personalInfo.fields.join('\n')} onChange={event => updatePersonal('fields', event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} /></label>
          </div>
        </section>
        <section className="editor-section">
          <div className="editor-section-heading"><h3>Services</h3><span>What you do</span></div>
          <div className="editor-stack">{draft.services.map((service, index) => <article className="editor-item" key={index}>
            <div className="editor-item-title"><span>0{index + 1}</span><strong>Service {index + 1}</strong></div>
            <div className="editor-fields">
              <label>Title<input value={service.title} onChange={event => updateService(index, 'title', event.target.value)} /></label>
              <label>Icon<input value={service.icon} onChange={event => updateService(index, 'icon', event.target.value)} /></label>
              <label className="field-wide">Description<textarea rows="3" value={service.desc} onChange={event => updateService(index, 'desc', event.target.value)} /></label>
              <label className="field-wide">Tags, one per line<textarea rows="2" value={service.tags.join('\n')} onChange={event => updateService(index, 'tags', event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} /></label>
            </div>
          </article>)}</div>
        </section>
        <section className="editor-section">
          <div className="editor-section-heading"><h3>Projects</h3><span>Case studies</span></div>
          <div className="editor-stack">{draft.projects.map((project, index) => <article className="editor-item" key={project.id}>
            <div className="editor-item-title"><span>0{index + 1}</span><strong>{project.client}</strong></div>
            <p className="image-help">Ảnh gốc và ảnh bìa của dự án luôn được giữ lại. Những ảnh bên dưới là ảnh bổ sung.</p>
            <ImageEditor images={project.images || []} onChange={images => updateProject(index, 'images', images)} onBusy={setImageBusy} />
            <label className="gallery-layout-control">Bố cục ảnh<select value={project.galleryLayout || 'grid'} onChange={event => updateProject(index, 'galleryLayout', event.target.value)}><option value="grid">Lưới hai cột</option><option value="stack">Ảnh lớn xếp dọc</option></select></label>
            <div className="editor-fields">
              <label>Project title<input value={project.title} onChange={event => updateProject(index, 'title', event.target.value)} /></label>
              <label>Client<input value={project.client} onChange={event => updateProject(index, 'client', event.target.value)} /></label>
              <label>Category<input value={project.category} onChange={event => updateProject(index, 'category', event.target.value)} /></label>
              <label className="field-wide">Summary<textarea rows="3" value={project.summary} onChange={event => updateProject(index, 'summary', event.target.value)} /></label>
              <label className="field-wide">Your contribution<textarea rows="3" value={project.role} onChange={event => updateProject(index, 'role', event.target.value)} /></label>
              <label className="field-wide">Impact<textarea rows="3" value={project.results} onChange={event => updateProject(index, 'results', event.target.value)} /></label>
              <label className="field-wide">Deliverables, one per line<textarea rows="3" value={project.outcomes.join('\n')} onChange={event => updateList(index, 'outcomes', event.target.value)} /></label>
              <label className="field-wide">Published links, one `name|url` per line<textarea rows="3" value={project.links.map(link => `${link.name}|${link.url}`).join('\n')} onChange={event => updateProject(index, 'links', event.target.value.split('\n').map(item => item.trim()).filter(Boolean).map(item => { const [name, ...url] = item.split('|'); return { name: name.trim(), url: url.join('|').trim() }; }))} /></label>
            </div>
          </article>)}</div>
        </section>
      </fieldset>
      <div className="editor-actions">{saveProgress && <span role="status">{saveProgress}</span>}{onPreview && <button className="button secondary" onClick={onPreview} disabled={saveState === 'saving' || imageBusy}>Xem trước</button>}<button className="text-link" onClick={onReset} disabled={saveState === 'saving' || imageBusy}>Reset saved changes</button><div>{saveState === 'error' && <span role="alert" className="save-status error">{saveError}</span>}{saveState === 'success' && <span role="status" className="save-status success">{remote ? 'Đã lưu. Website đang chờ triển khai bản mới.' : 'Saved to file and pushed to GitHub.'}</span>}<button className="button secondary" onClick={onClose} disabled={saveState === 'saving' || imageBusy}>Cancel</button><button className="button" onClick={onSave} disabled={saveState === 'saving' || imageBusy}>{saveState === 'saving' ? 'Saving & pushing…' : 'Save changes'} <Arrow /></button></div></div>
    </dialog>
  );
}

function CaseStudy({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const element = dialog.current;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog ref={dialog} className="case-dialog" onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="case-title">
      <div className="case-header"><span>Inside the project ✦</span><button className="icon-button" onClick={onClose} aria-label="Close case study">×</button></div>
      <div className="case-body">
        <span className="pill">{project.category}</span>
        <h2 id="case-title">{project.title}</h2>
        <p className="case-client">{project.client}</p>
        {project.index !== 7 && <img className="case-image" src={`/work/${work[project.index].image}`} alt={`Portfolio reference for ${project.client}`} />}
        {project.images?.length > 0 && <div className={`project-gallery gallery-${project.galleryLayout || 'grid'}`}>{project.images.map((image, index) => <figure key={index}><a href={image.src} target="_blank" rel="noreferrer"><img src={image.src} alt={image.alt || project.title} style={imageStyle(image)} loading="lazy" /></a>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>}
        <h3>The brief</h3><p>{project.summary}</p>
        <h3>My contribution</h3><p>{project.role}</p>
        <h3>The deliverables</h3><ul>{project.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
        <div className="result-box"><span className="eyebrow">THE IMPACT</span><p>{project.results}</p></div>
        <h3>See the published work</h3>
        <div className="reference-links">{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.name} <Arrow /></a>)}</div>
      </div>
    </dialog>
  );
}

export default function App({ previewData = null }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedPortfolio, setPortfolio] = useState(() => {
    if (!LOCAL_FILE_SAVE) return cloneData(data);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...cloneData(data), ...JSON.parse(saved) } : cloneData(data);
    } catch {
      return cloneData(data);
    }
  });
  const [editorDraft, setEditorDraft] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const editing = Boolean(editorDraft) && !previewData;
  const portfolio = previewData || editorDraft || savedPortfolio;
  const [saveState, setSaveState] = useState('idle');
  const [saveError, setSaveError] = useState('');
  const projects = portfolio.projects.map((project, index) => ({ ...project, index }))
    .filter(project => filter === 0 || work[project.index].tags.includes(filter));
  const visible = expanded ? projects : projects.slice(0, 4);
  const openEditor = () => { if (!editing) { setEditorDraft(cloneData(savedPortfolio)); setSelectedProject(null); } };
  const update = (section, field, value, index) => {
    setEditorDraft(current => ({ ...current, [section]: index === undefined ? { ...current[section], [field]: value } : current[section].map((item, i) => i === index ? { ...item, [field]: value } : item) }));
    setSaveState('idle');
  };
  const text = (section, field, index, fallback = '') => <EditableText value={(index === undefined ? portfolio[section][field] : portfolio[section][index][field]) ?? fallback} enabled={editing && saveState !== 'saving' && !imageBusy} label={field} onChange={value => update(section, field, value, index)} />;
  const listEditor = (section, field, label, index) => <label>{label}<textarea rows="3" value={(index === undefined ? portfolio[section][field] : portfolio[section][index][field]).join('\n')} onChange={event => update(section, field, event.target.value.split('\n'), index)} /></label>;

  const closeEditor = () => {
    if (saveState === 'saving' || imageBusy) return;
    setEditorDraft(null);
    setSaveState('idle');
    setSaveError('');
  };
  const saveEditor = async () => {
    setSaveState('saving');
    setSaveError('');
    const cleanedDraft = cloneData(editorDraft);
    const cleanList = items => items.map(item => item.trim()).filter(Boolean);
    cleanedDraft.personalInfo.fields = cleanList(cleanedDraft.personalInfo.fields);
    cleanedDraft.services.forEach(service => { service.tags = cleanList(service.tags); });
    cleanedDraft.projects.forEach(project => {
      project.outcomes = cleanList(project.outcomes);
      project.links = project.links.map(link => ({ name: link.name.trim(), url: link.url.trim() }))
        .filter(link => link.name || link.url);
    });
    try {
      if (LOCAL_FILE_SAVE) {
        const response = await fetch('/api/local-save-portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanedDraft),
        });
        const result = await response.json().catch(() => ({}));
        if (result.savedLocally) {
          setPortfolio(cloneData(cleanedDraft));
          try { localStorage.removeItem(STORAGE_KEY); } catch { /* File is saved. */ }
        }
        if (!response.ok || result.ok !== true) throw new Error(result.error || 'The local save server is unavailable. Restart npm run dev and try again.');
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* File is already saved. */ }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedDraft));
      }
      setPortfolio(cloneData(cleanedDraft));
      setEditorDraft(cloneData(cleanedDraft));
      setSaveState('success');
    } catch (error) {
      setSaveState('error');
      setSaveError(error.message || 'Could not save your changes. Please try again.');
    }
  };
  return (
    <>
      {editing && <section className="inline-toolbar" aria-label="Chỉnh sửa portfolio"><div><strong>✎ Đang chỉnh trực tiếp</strong><p>Bấm vào chữ có viền để sửa ngay tại vị trí đó.</p></div><div className="preview-buttons"><button className="button secondary" disabled={saveState === 'saving' || imageBusy} onClick={closeEditor}>{saveState === 'success' ? 'Hoàn tất' : 'Hủy chỉnh sửa'}</button><button className="button" onClick={saveEditor} disabled={saveState === 'saving' || imageBusy}>{saveState === 'saving' ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>{saveState === 'success' && <p role="status">Đã lưu thay đổi và đẩy lên GitHub.</p>}{saveState === 'error' && <p role="alert" className="admin-error">{saveError}</p>}</section>}
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header shell">
        <a className="wordmark" href="#home" aria-label="Xana home">xana<span>✳</span><small>the creative space</small></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close ×' : 'Menu ☰'}</button>
        <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation">
          {[['projects', 'My work'], ['services', 'What I do'], ['about', 'Meet Ngân']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          {LOCAL_FILE_SAVE && !previewData && <button className="button small editor-launch" onClick={() => { openEditor(); setMenuOpen(false); }} disabled={editing}>Edit portfolio <span aria-hidden="true">✎</span></button>}
          <a className="button small" href="#contact" onClick={() => setMenuOpen(false)}>Let’s connect <Arrow /></a>
        </nav>
      </header>
      <main id="main">
        <section className="hero shell" id="home">
          <div className="hero-copy">
            <span className="hello-pill"><span aria-hidden="true">✦</span> A little creativity. A lot of intention.</span>
            <p className="hero-greeting">{text('personalInfo', 'greeting', undefined, 'Hey, I’m Ngân')} <span aria-hidden="true">☀</span></p>
            <h1>{text('personalInfo', 'headline', undefined, 'Content Creator')}<span className="role-line">& <span className="highlight">{text('personalInfo', 'headlineSecond', undefined, 'Copywriter.')}</span></span></h1>
            <p className="hero-description">{text('personalInfo', 'heroDescription', undefined, 'I turn brand briefs into stories worth reading, videos worth watching, and content worth connecting with.')}</p>
            <div className="hero-actions"><a className="button" href="#projects">Take a look at my work <Arrow /></a><a className="text-link" href="#about">Get to know me <span aria-hidden="true">↓</span></a></div>
            <div className="hero-specialties"><span>✎ Words that connect</span><span>▷ Scripts that click</span></div>
          </div>
          <div className="creator-scene">
            <div className="portrait-shape" />
            <div className="portrait-card"><img src={portfolio.personalInfo.portrait?.src || "/work/ngan.jpg"} style={portfolio.personalInfo.portrait ? imageStyle(portfolio.personalInfo.portrait) : undefined} alt={portfolio.personalInfo.portrait?.alt || "Xuân Ngân sitting on the grass"} fetchPriority="high" /><div className="portrait-caption"><span>{text('personalInfo', 'portraitCaption', undefined, 'Ngân, aka XANA')}</span><span aria-hidden="true">♡</span></div></div>
            <div className="floating-tag tag-script"><span className="tag-icon">▷</span><div><strong>From brief to “play”</strong><small>Concepts + video scripts</small></div></div>
            <div className="floating-tag tag-copy"><span className="tag-icon">✎</span><div><strong>A good story starts here.</strong><small>One idea. The right words.</small></div></div>
            <span className="scene-spark" aria-hidden="true">✳</span><span className="scene-spark small-spark" aria-hidden="true">✦</span>
            <span className="hand-note">your next creative partner <span aria-hidden="true">⤴</span></span>
          </div>
        </section>
        {editing && <fieldset className="inline-image-panel shell" disabled={saveState === 'saving' || imageBusy}><legend>Ảnh cá nhân · đầu trang và phần giới thiệu</legend><ImageEditor portrait images={portfolio.personalInfo.portrait ? [portfolio.personalInfo.portrait] : []} onChange={images => update('personalInfo', 'portrait', images[0] || null)} onBusy={setImageBusy} /></fieldset>}
        <section className="brands shell" aria-label="Brand experience"><p>A few brands I’ve created content for</p><div><span>MB<span className="brand-star">✦</span></span><span className="vgj">VietinBank<small>GOLD & JEWELLERY</small></span><span>PÖNNIE</span><span className="oliv">Ôliv</span><span className="purite">Purité</span><span>monte</span><span className="alist">THE A LIST.</span></div></section>
        <section className="services-section shell" id="services">
          <div className="section-heading"><div><span className="eyebrow">MY CREATIVE TOOLKIT</span><h2>Different formats.<br /><span>Same love for storytelling.</span></h2></div><p>From the first idea to the final caption,<br />here’s how I bring a brand’s story to life.</p></div>
            <div className="services-grid">{portfolio.services.map((service, index) => <article className={`service-card service-${index}`} key={index}><span className="service-icon" aria-hidden={!editing}>{text('services', 'icon', index)}</span><h3>{text('services', 'title', index)}</h3><p>{text('services', 'desc', index)}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{editing && <fieldset className="inline-fields" disabled={saveState === 'saving' || imageBusy}>{listEditor('services', 'tags', 'Tags · mỗi dòng một mục', index)}</fieldset>}</article>)}</div>
        </section>
        <section className="work-section" id="projects"><div className="shell">
          <div className="section-heading"><div><span className="eyebrow">A PEEK INTO MY WORK</span><h2>Made with ideas.<br /><span>And a little bit of me.</span> <span className="heading-spark" aria-hidden="true">✳</span></h2></div><a className="text-link" href={CANVA_PORTFOLIO_URL} target="_blank" rel="noreferrer">View full portfolio <Arrow /></a></div>
          <div className="filter-bar" aria-label="Filter projects">{filters.map((label, index) => <button key={label} className={filter === index ? 'filter active' : 'filter'} aria-pressed={filter === index} onClick={() => { setFilter(index); setExpanded(false); }}>{label}{index === 0 && <span>{portfolio.projects.length}</span>}</button>)}</div>
          <div className="project-grid">{visible.map(project => {
            const visual = work[project.index];
            return <article className="project-card" key={project.id}>
              <div className={`project-visual ${visual.color}`}>
                <span className="project-brand">{text('projects', 'client', project.index)}</span>
                <div className={`work-frame ${[0, 1].includes(project.index) ? 'article-frame' : 'video-frame'} ${project.index === 7 ? 'wide-frame' : ''}`}>
                  <div className="frame-top"><span /><span /><span /><small>{visual.tags.includes(2) ? 'creator’s corner' : 'brand stories'}</small></div>
                  <img src={`/work/${visual.image}`} alt={project.index === 7 ? 'Creative workspace illustration' : `${project.client} campaign reference from Ngân’s portfolio`} loading="lazy" />
                </div>
                {visual.tags.includes(2) && project.index !== 7 && <span className="play-badge" aria-hidden="true">▷</span>}
                <span className="result-sticker">✦ {text('projects', 'results', project.index)}</span>
                <span className="open-project" aria-hidden="true">↗</span>
              </div>
              <div className="project-info"><span className="project-format">{text('projects', 'category', project.index)}</span><h3>{text('projects', 'title', project.index)}</h3><p>{text('projects', 'summary', project.index)}</p><button className="case-link project-open" disabled={editing} onClick={() => setSelectedProject(project)}>Explore the project <Arrow /></button></div>
              {editing && <details className="inline-project-details"><summary>Chỉnh chi tiết & ảnh dự án</summary><fieldset className="inline-fields" disabled={saveState === 'saving' || imageBusy}>
                <label>Đóng góp<textarea value={project.role} onChange={event => update('projects', 'role', event.target.value, project.index)} /></label>
                {listEditor('projects', 'outcomes', 'Deliverables · mỗi dòng một mục', project.index)}
                <label>Liên kết · mỗi dòng tên|URL<textarea rows="3" value={project.links.map(link => link.name + '|' + link.url).join('\n')} onChange={event => update('projects', 'links', event.target.value.split('\n').map(line => { const [name, ...url] = line.split('|'); return { name, url: url.join('|') }; }), project.index)} /></label>
                <ImageEditor images={project.images || []} onChange={images => update('projects', 'images', images, project.index)} onBusy={setImageBusy} />
                <label>Bố cục ảnh<select value={project.galleryLayout || 'grid'} onChange={event => update('projects', 'galleryLayout', event.target.value, project.index)}><option value="grid">Lưới hai cột</option><option value="stack">Ảnh lớn xếp dọc</option></select></label>
              </fieldset></details>}
            </article>;
          })}</div>
          <div className="work-bottom"><span aria-live="polite">{visible.length} of {projects.length} projects</span>{projects.length > 4 && <button className="button secondary" onClick={() => setExpanded(!expanded)}>{expanded ? 'A little less' : 'There’s more where that came from'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}</div>
        </div></section>
        <section className="about-section shell" id="about">
          <div className="about-photo"><img src={portfolio.personalInfo.portrait?.src || "/work/ngan.jpg"} style={portfolio.personalInfo.portrait ? imageStyle(portfolio.personalInfo.portrait) : undefined} alt={portfolio.personalInfo.portrait?.alt || "Meet Ngân, the writer behind XANA"} loading="lazy" /><div className="about-photo-note">A curious mind,<br />a notes app full of ideas. <span aria-hidden="true">♡</span></div><span className="about-flower" aria-hidden="true">✳</span></div>
            <div className="about-copy"><span className="eyebrow">THE HUMAN BEHIND THE CONTENT</span><h2>Hi again.<br />You can call me <span>{text('personalInfo', 'nickname')}.</span></h2><p className="full-name">{text('personalInfo', 'name')} · {text('personalInfo', 'role')}</p><p>{text('personalInfo', 'bio')}</p><p>I enjoy finding the small human insight that turns a brand message into something people actually care about.</p><div className="industry-tags">{portfolio.personalInfo.fields.map(field => <span key={field}>{field}</span>)}</div>{editing && <fieldset className="inline-fields" disabled={saveState === 'saving' || imageBusy}>{listEditor('personalInfo', 'fields', 'Lĩnh vực · mỗi dòng một mục')}</fieldset>}<div className="stats-row"><div><strong>2+</strong><span>Years creating content</span></div><div><strong>3,600+</strong><span>Project outcomes delivered</span></div></div></div>
        </section>
        <section className="process-section shell"><span className="eyebrow">HOW WE CAN WORK TOGETHER</span><h2>Good content starts with <span>a good conversation.</span></h2><div className="process-grid">{[['Let’s talk', 'Your brand, your audience, and what you want to say.'], ['Find the idea', 'A clear direction, a fresh angle, and a concept that fits.'], ['Make it happen', 'Thoughtful writing, collaborative feedback, and content ready to go.']].map(([title, description], index) => <div key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div></section>
        {editing && <section className="shell inline-contact"><h3>Thông tin liên hệ</h3><fieldset className="inline-fields" disabled={saveState === 'saving' || imageBusy}>{['email', 'phone', 'linkedin'].map(field => <label key={field}>{field}<input value={portfolio.personalInfo[field]} onChange={event => update('personalInfo', field, event.target.value)} /></label>)}</fieldset></section>}
        <section className="contact-section shell" id="contact"><div className="contact-card"><span className="contact-spark" aria-hidden="true">✳</span><span className="eyebrow">GOT A BRIEF? OR JUST A BIG IDEA?</span><h2>Let’s make something<br /><span>worth sharing.</span></h2><p>Your next brand story could start with a hello.</p><a className="button" href={`mailto:${portfolio.personalInfo.email}`}>Say hello to {portfolio.personalInfo.nickname} <Arrow /></a><a className="email-link" href={`mailto:${portfolio.personalInfo.email}`}>{portfolio.personalInfo.email}</a><span className="contact-doodle" aria-hidden="true">☺</span></div></section>
      </main>
      <footer className="footer shell"><a className="wordmark" href="#home">xana<span>✳</span></a><p>© {new Date().getFullYear()} {text('personalInfo', 'name')} · A little creativity, always.</p><div><a href={portfolio.personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href={`tel:${portfolio.personalInfo.phone.replace(/[^\d+]/g, '')}`}>Call me <Arrow /></a>{LOCAL_FILE_SAVE && !previewData && <button className="footer-edit" onClick={openEditor}>Edit <span aria-hidden="true">✎</span></button>}<a href="#home" aria-label="Back to top">↑</a></div></footer>
      {selectedProject && !editing && <CaseStudy project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
}
