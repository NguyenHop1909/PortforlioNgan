import { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA as data } from './data/portfolio';
import { CANVA_PORTFOLIO_URL } from './data/projectsData';
import './App.css';

const filters = ['All projects', 'Brand writing', 'Video scripts', 'Social content'];
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
const services = [
  { icon: '✎', title: 'Brand writing', desc: 'The right words, in your brand’s voice. From PR articles to launch stories and campaign copy.', tags: ['PR articles', 'Brand storytelling', 'Copywriting'] },
  { icon: '▷', title: 'Video scripts', desc: 'A hook that gets attention. A story that holds it. Scripts made for creators and their audiences.', tags: ['TikTok & Reels', 'KOL / KOC scripts', 'Creative concepts'] },
  { icon: '✳', title: 'Social content', desc: 'Content that makes brands part of the conversation, with a clear plan behind every post.', tags: ['Social captions', 'Content planning', 'Community'] },
];
function Arrow() { return <span aria-hidden="true">↗</span>; }

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

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const projects = data.projects.map((project, index) => ({ ...project, index }))
    .filter(project => filter === 0 || work[project.index].tags.includes(filter));
  const visible = expanded ? projects : projects.slice(0, 4);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header shell">
        <a className="wordmark" href="#home" aria-label="Xana home">xana<span>✳</span><small>the creative space</small></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close ×' : 'Menu ☰'}</button>
        <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation">
          {[['projects', 'My work'], ['services', 'What I do'], ['about', 'Meet Ngân']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="button small" href="#contact" onClick={() => setMenuOpen(false)}>Let’s connect <Arrow /></a>
        </nav>
      </header>
      <main id="main">
        <section className="hero shell" id="home">
          <div className="hero-copy">
            <span className="hello-pill"><span aria-hidden="true">✦</span> A little creativity. A lot of intention.</span>
            <p className="hero-greeting">Hey, I’m Ngân <span aria-hidden="true">☀</span></p>
            <h1>Content Creator<span className="role-line">& <span className="highlight">Copywriter.</span></span></h1>
            <p className="hero-description">I turn brand briefs into <strong>stories worth reading, videos worth watching,</strong> and content worth connecting with.</p>
            <div className="hero-actions"><a className="button" href="#projects">Take a look at my work <Arrow /></a><a className="text-link" href="#about">Get to know me <span aria-hidden="true">↓</span></a></div>
            <div className="hero-specialties"><span>✎ Words that connect</span><span>▷ Scripts that click</span></div>
          </div>
          <div className="creator-scene">
            <div className="portrait-shape" />
            <div className="portrait-card"><img src="/work/ngan.jpg" alt="Xuân Ngân sitting on the grass" fetchPriority="high" /><div className="portrait-caption"><span>Ngân, aka XANA</span><span aria-hidden="true">♡</span></div></div>
            <div className="floating-tag tag-script"><span className="tag-icon">▷</span><div><strong>From brief to “play”</strong><small>Concepts + video scripts</small></div></div>
            <div className="floating-tag tag-copy"><span className="tag-icon">✎</span><div><strong>A good story starts here.</strong><small>One idea. The right words.</small></div></div>
            <span className="scene-spark" aria-hidden="true">✳</span><span className="scene-spark small-spark" aria-hidden="true">✦</span>
            <span className="hand-note">your next creative partner <span aria-hidden="true">⤴</span></span>
          </div>
        </section>
        <section className="brands shell" aria-label="Brand experience"><p>A few brands I’ve created content for</p><div><span>MB<span className="brand-star">✦</span></span><span className="vgj">VietinBank<small>GOLD & JEWELLERY</small></span><span>PÖNNIE</span><span className="oliv">Ôliv</span><span className="purite">Purité</span><span>monte</span><span className="alist">THE A LIST.</span></div></section>
        <section className="services-section shell" id="services">
          <div className="section-heading"><div><span className="eyebrow">MY CREATIVE TOOLKIT</span><h2>Different formats.<br /><span>Same love for storytelling.</span></h2></div><p>From the first idea to the final caption,<br />here’s how I bring a brand’s story to life.</p></div>
          <div className="services-grid">{services.map((service, index) => <article className={`service-card service-${index}`} key={service.title}><span className="service-icon" aria-hidden="true">{service.icon}</span><h3>{service.title}</h3><p>{service.desc}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div>
        </section>
        <section className="work-section" id="projects"><div className="shell">
          <div className="section-heading"><div><span className="eyebrow">A PEEK INTO MY WORK</span><h2>Made with ideas.<br /><span>And a little bit of me.</span> <span className="heading-spark" aria-hidden="true">✳</span></h2></div><a className="text-link" href={CANVA_PORTFOLIO_URL} target="_blank" rel="noreferrer">View full portfolio <Arrow /></a></div>
          <div className="filter-bar" aria-label="Filter projects">{filters.map((label, index) => <button key={label} className={filter === index ? 'filter active' : 'filter'} aria-pressed={filter === index} onClick={() => { setFilter(index); setExpanded(false); }}>{label}{index === 0 && <span>{data.projects.length}</span>}</button>)}</div>
          <div className="project-grid">{visible.map(project => {
            const visual = work[project.index];
            return <button className="project-card" key={project.id} onClick={() => setSelectedProject(project)} aria-label={`View case study: ${project.title}`}>
              <div className={`project-visual ${visual.color}`}>
                <span className="project-brand">{visual.brand}</span>
                <div className={`work-frame ${[0, 1].includes(project.index) ? 'article-frame' : 'video-frame'} ${project.index === 7 ? 'wide-frame' : ''}`}>
                  <div className="frame-top"><span /><span /><span /><small>{visual.tags.includes(2) ? 'creator’s corner' : 'brand stories'}</small></div>
                  <img src={`/work/${visual.image}`} alt={project.index === 7 ? 'Creative workspace illustration' : `${visual.brand} campaign reference from Ngân’s portfolio`} loading="lazy" />
                </div>
                {visual.tags.includes(2) && project.index !== 7 && <span className="play-badge" aria-hidden="true">▷</span>}
                <span className="result-sticker">✦ {visual.result}</span>
                <span className="open-project" aria-hidden="true">↗</span>
              </div>
              <div className="project-info"><span className="project-format">{visual.format}</span><h3>{visual.title}</h3><p>{project.summary}</p><span className="case-link">Explore the project <Arrow /></span></div>
            </button>;
          })}</div>
          <div className="work-bottom"><span aria-live="polite">{visible.length} of {projects.length} projects</span>{projects.length > 4 && <button className="button secondary" onClick={() => setExpanded(!expanded)}>{expanded ? 'A little less' : 'There’s more where that came from'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}</div>
        </div></section>
        <section className="about-section shell" id="about">
          <div className="about-photo"><img src="/work/ngan.jpg" alt="Meet Ngân, the writer behind XANA" loading="lazy" /><div className="about-photo-note">A curious mind,<br />a notes app full of ideas. <span aria-hidden="true">♡</span></div><span className="about-flower" aria-hidden="true">✳</span></div>
          <div className="about-copy"><span className="eyebrow">THE HUMAN BEHIND THE CONTENT</span><h2>Hi again.<br />You can call me <span>Ngân.</span></h2><p className="full-name">Nguyễn Phúc Xuân Ngân · Content Creator / Copywriter</p><p>{data.personalInfo.bio}</p><p>I enjoy finding the small human insight that turns a brand message into something people actually care about.</p><div className="industry-tags">{data.personalInfo.fields.map(field => <span key={field}>{field}</span>)}</div><div className="stats-row"><div><strong>2+</strong><span>Years creating content</span></div><div><strong>3,600+</strong><span>Project outcomes delivered</span></div></div></div>
        </section>
        <section className="process-section shell"><span className="eyebrow">HOW WE CAN WORK TOGETHER</span><h2>Good content starts with <span>a good conversation.</span></h2><div className="process-grid">{[['Let’s talk', 'Your brand, your audience, and what you want to say.'], ['Find the idea', 'A clear direction, a fresh angle, and a concept that fits.'], ['Make it happen', 'Thoughtful writing, collaborative feedback, and content ready to go.']].map(([title, description], index) => <div key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div></section>
        <section className="contact-section shell" id="contact"><div className="contact-card"><span className="contact-spark" aria-hidden="true">✳</span><span className="eyebrow">GOT A BRIEF? OR JUST A BIG IDEA?</span><h2>Let’s make something<br /><span>worth sharing.</span></h2><p>Your next brand story could start with a hello.</p><a className="button" href={`mailto:${data.personalInfo.email}`}>Say hello to Ngân <Arrow /></a><a className="email-link" href={`mailto:${data.personalInfo.email}`}>{data.personalInfo.email}</a><span className="contact-doodle" aria-hidden="true">☺</span></div></section>
      </main>
      <footer className="footer shell"><a className="wordmark" href="#home">xana<span>✳</span></a><p>© {new Date().getFullYear()} Xuân Ngân · A little creativity, always.</p><div><a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="tel:+84328818165">Call me <Arrow /></a><a href="#home" aria-label="Back to top">↑</a></div></footer>
      {selectedProject && <CaseStudy project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  );
}
