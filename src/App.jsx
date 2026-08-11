import React, { useState } from 'react';
import './App.css'; // Uses your custom styling

const PORTFOLIO_DATA = {
  personalInfo: {
    name: "NGUYỄN PHÚC XUÂN NGÂN",
    nickname: "XANA",
    role: "Content Writer | Content, PR, Social",
    email: "xuanganxn@gmail.com",
    phone: "(+84) 328-818-165",
    linkedin: "https://linkedin.com/in/xuanganxn/",
    bio: "With 2 years of experience specializing in performance-driven content, I focus on crafting language experiences that naturally inspire user action. I believe the power of content lies in balance: being contemporary enough to lead trends while remaining grounded in the brand's core values.",
    stats: "3,600+ successful project outcomes delivered over 2 years",
    fields: ["F&B", "Technology", "Lifestyle", "Beauty", "Healthcare"]
  },
  skills: [
    { name: "PR & Brand", desc: "Multi-platform & Social storytelling" },
    { name: "Storytelling", desc: "Scriptwriting, Copywriting & Engagement" },
    { name: "Integrated Content", desc: "Strategic Framework & Channel Management" },
    { name: "Visual Direction", desc: "Content Framework, Operations & Management" }
  ],
  projects: [
    {
      id: "mb-bank",
      title: "MB 'Patriotic Tree' Campaign",
      client: "MBBank",
      category: "PR & CSR Strategy",
      summary: "A nationwide CSR initiative building brand prestige through small, impactful actions and authentic experiences.",
      role: "Led the PR direction for the campaign, defining both visual and editorial strategies while executing tailored press articles and in-depth CSR analysis to amplify social impact.",
      outcomes: [
        "5 lead articles (including content & visual direction)",
        "15 sub-articles (executed based on editorial direction)",
        "Brand-owned channel posts",
        "Community group posts (Caption & Visual direction)"
      ],
      results: "Drove over 3,000,000 digital engagements, successfully amplifying the campaign's CSR values while solidifying brand authority across major media outlets.",
      links: [
        { name: "Brands Vietnam", url: "https://www.brandsvietnam.com/cay-yeu-nuoc-cach-mb-xay-dung-hinh-anh-thuong-hieu-bang-hanh-dong-nho-va-trai-nghiem-that" },
        { name: "The Influencer", url: "https://theinfluencer.vn/cay-yeu-nuoc-mb-khi-mot-trai-nghiem-rat-nho-tao-ra-lan-toa-csr-o-quy-mo-toan-quoc" },
        { name: "CafeF", url: "https://cafef.vn/cay-yeu-nuoc-mb-phu-xanh-cac-chi-nhanh-mb-gieo-tu-hao-chay-khap-non-song-188251212132959284.chn" },
        { name: "Tuoi Tre Online", url: "https://tuoitre.vn/mb-trien-khai-toan-quoc-du-an-cay-yeu-nuoc-20251216154514867.htm" },
        { name: "Kenh14", url: "https://kenh14.vn/tu-mot-ly-nuoc-sach-den-hang-tram-diem-cham-nhan-van-mb-truyen-cam-hung-tu-loi-choi-chu-cay-yeu-nuoc-215251217170128696.chn" }
      ],
      hashtags: "#MB #MKT #MByeunuoc #CayyeunuocMB #Gieotuhaochaykhapnonsong"
    },
    {
      id: "vietinbank-gold",
      title: "2025 Collection Launch",
      client: "VietinBank Gold & Jewellery",
      category: "Product Launch PR",
      summary: "Launching the 'Loc Tien Vinh Hoa' Lunar New Year 2025 collection.",
      role: "Participated in executing the editorial and visual direction for the collection launch, executing integrated PR and social media content across brand-owned and partnership channels.",
      outcomes: [
        "2 lead articles (including content & visual direction)",
        "Brand-owned channel posts",
        "Brand-partnership campaign posts"
      ],
      results: "Achieved over 35,000,000 total engagements and nearly 30,000,000 website clicks, effectively driving high-intent traffic and optimizing the conversion funnel.",
      links: [
        { name: "VNExpress", url: "https://vnexpress.net/vietinbank-gold-jewellery-ra-mat-tang-pham-linh-vat-tet-at-ty-4835968.html" },
        { name: "CafeF", url: "https://cafef.vn/tuyet-tac-qua-tang-phuc-loc-va-giai-phap-dac-quyen-cho-doanh-nghiep-dip-tet-at-ty-188250104114958886.chn" }
      ],
      hashtags: "#VietinBankGold_Jewellery #VGJ #LinhVatTet2025"
    },
    {
      id: "ponnie-party",
      title: "Friday 'Sáusage' Party",
      client: "PÖNNIE PARTY",
      category: "KOL & Social Campaign",
      summary: "Positioning Pönnie as a trendy, must-have snack for home social gatherings.",
      role: "Participated in developing creative scripts for Macro KOLs (Linda Ngo) while managing visual direction and copy for community pages to amplify video content and editorial pillars.",
      outcomes: [
        "Video scripts for Macro KOLs",
        "Video scripts & content for amplified communities",
        "KOL / KOC Briefs",
        "Editorial direction for marketing channels"
      ],
      results: "Achieved nearly 2,500,000 views from KOL content and over 1,100,000 engagements across lifestyle platforms.",
      links: [
        { name: "TikTok Linda Ngo", url: "https://www.tiktok.com/@heyiamlinda/video/7554369700667378962" }
      ],
      hashtags: "#SausageParty #Thu6LenTiecSausage #Ponnie #XucXichVong #NgonGionMong"
    },
    {
      id: "nam-ngu-phu-quoc",
      title: "Nam Ngu Phu Quoc Launching",
      client: "Nam Ngu",
      category: "KOL Viral Campaign",
      summary: "Launching the premium Nam Ngu Phu Quoc fish sauce line in a competitive market.",
      role: "Led campaign execution, meticulously refining Macro KOL scripts to ensure product accuracy while crafting compelling hooks to maximize audience retention.",
      outcomes: [
        "Video scripts for KOLs (Macro / Micro / Nano)",
        "KOL Briefs"
      ],
      results: "Successfully resonated with consumer needs, achieving over 7,000,000 views and 300,000 engagements.",
      links: [
        { name: "TikTok Khanh Van", url: "https://www.tiktok.com/@khanhvanofficial/video/7606324808288128276" },
        { name: "TikTok Trox & Lacci", url: "https://www.tiktok.com/@troxlacci/video/7621172227857321236" },
        { name: "TikTok Trang Tam", url: "https://www.tiktok.com/@trangtam2607/video/7620776022375566612" }
      ],
      hashtags: "#NamNgu #NamNguPhuQuoc #Namngudacsan #Conamnguthemhanhphuc"
    },
    {
      id: "oliv-series",
      title: "Ôliv Series (2025 - 2026)",
      client: "Ôliv Natural Nourish",
      category: "Always-on & Minigame",
      summary: "Multi-quarter campaign boosting sales for core hair and body care categories.",
      role: "Developed the strategic content framework and managed KOL/KOC script execution, while leading end-to-end minigame activations (visuals, copy, and T&Cs).",
      outcomes: [
        "Video scripts for KOLs / KOCs",
        "KOL / KOC Briefs",
        "Minigame Content & Terms Management"
      ],
      results: "Effectively boosted sales for key categories, consistently delivering over 800,000 total engagements per seasonal launch.",
      links: [
        { name: "TikTok Official Ôliv", url: "https://www.tiktok.com/@olivnaturalnourish" }
      ],
      hashtags: "#Olivnatural #Ôliv #daugoioliv #suatamoliv #dautamoliv"
    },
    {
      id: "purite-series",
      title: "Purité Series (2024 - 2026)",
      client: "Purité de Prövence",
      category: "Integrated Campaign",
      summary: "Promoting body wash, hair care, and deodorant lines across festive seasons.",
      role: "Led end-to-end campaign execution from Q4/2024 to Q1/2026, developing integrated Content Houses, Creative Devices, and tailored scripts for a wide spectrum of KOLs.",
      outcomes: [
        "Video scripts for KOLs (Macro to Nano)",
        "Content House & Creative Devices Framework",
        "KOL / KOC Briefs"
      ],
      results: "Successfully elevated brand sentiment and boosted sales, delivering over 1,000,000 total engagements per seasonal campaign.",
      links: [
        { name: "TikTok Official Purité", url: "https://www.tiktok.com/@purite_official" }
      ],
      hashtags: "#purité #puritedeprovence #suatamnuochoa #lankhumuitrangda"
    },
    {
      id: "zott-2025",
      title: "ZOTT Full Year Campaign 2025",
      client: "ZOTT VIETNAM (Monte)",
      category: "Social & Community",
      summary: "Strengthening the emotional bond between Monte and its target audience.",
      role: "Managed full-year content execution, developing high-retention hooks for KOL/KOC networks while leading visual and editorial direction for community posts and the Monte fanpage.",
      outcomes: [
        "Video scripts for KOLs (Macro / Micro / Nano)",
        "Captions & Designed visuals for Community groups",
        "KOL / KOC Briefs"
      ],
      results: "Amplified the brand core message, effectively strengthening emotional connection and trust with young parents.",
      links: [
        { name: "Facebook Váng sữa Monte", url: "https://www.facebook.com/vang.sua.monte" }
      ],
      hashtags: "#MonteVN #DanDinhDuongTruyenYeuThuong #DamThemDinhDuong"
    },
    {
      id: "the-a-list",
      title: "THE A LIST SMC Owned Channels",
      client: "THE A LIST Agency",
      category: "Employer Branding & Social",
      summary: "Building brand awareness and establishing employer brand authority.",
      role: "Partnered with Copywriters to develop monthly frameworks, executing scripts, captions, and visual directions across Facebook, LinkedIn, and Instagram, while managing overall channel performance.",
      outcomes: [
        "Monthly content frameworks",
        "Video scripts & Video editing",
        "Captions & Visual directions",
        "Channel operations & Performance analytics"
      ],
      results: "Achieved a monthly average increase of 50,000 - 80,000 views and a 12-15% rise in conversion rates through diverse case study series.",
      links: [
        { name: "Facebook The A List", url: "https://www.facebook.com/TheAList.vn" },
        { name: "LinkedIn The A List", url: "https://www.linkedin.com/company/the-a-list-viet-nam/" },
        { name: "Instagram The A List", url: "https://www.instagram.com/thealist.vn/" }
      ],
      hashtags: "#TheAList #AgencyLife #CaseStudy"
    }
  ]
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="portfolio-app">
      {/* NAVIGATION HEADER */}
      <header>
        <div className="nav-wrap">
          <div className="logo">{PORTFOLIO_DATA.personalInfo.nickname}</div>
          <nav>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Expertise</a></li>
              <li><a href="#projects">Featured Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="sky-theme">
        {/* CHÈN THẺ IMG BẦU TRỜI MÂY VÀO ĐÂY */}
        <img 
          src="/IMAGE/Cloudy_sky.jpg" 
          alt="Cloudy Sky Background" 
          className="hero-bg-image" 
        />

        <div className="hero">
          <div className="leaf-decoration left">🌿</div>
          <div className="leaf-decoration right">🍃</div>
          
          <div className="hero-card">
            <div className="hero-avatar">
              <span>XN</span>
            </div>
            <h1>{PORTFOLIO_DATA.personalInfo.name}</h1>
            <p className="subtitle">{PORTFOLIO_DATA.personalInfo.role}</p>
            <p className="intro-text">{PORTFOLIO_DATA.personalInfo.bio}</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about">
        <h2>Who I Am & What I Cover</h2>
        <div className="about-text">
          <p>
            Leveraging expertise across diverse industries:{" "}
            <strong>{PORTFOLIO_DATA.personalInfo.fields.join(" • ")}</strong>.
          </p>
          <div className="skills-grid" style={{ marginTop: '1.5rem' }}>
            <div className="skill-item">
              <span className="skill-icon">🏆</span>
              <div>
                <strong>Proven Track Record</strong>
                <p style={{ fontSize: '0.85rem' }}>{PORTFOLIO_DATA.personalInfo.stats}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE / SKILLS */}
      <section id="services" style={{ padding: '4rem 8%', background: '#fff' }}>
        <h2>Core Expertise</h2>
        <div className="skills-grid">
          {PORTFOLIO_DATA.skills.map((skill, idx) => (
            <div key={idx} className="skill-item">
              <span className="skill-icon">✨</span>
              <div>
                <strong>{skill.name}</strong>
                <p style={{ fontSize: '0.85rem', color: '#555' }}>{skill.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="projects">
        <h2>Featured Projects</h2>
        <div className="projects-grid">
          {PORTFOLIO_DATA.projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div>
                <span className="category-tag">{project.category}</span>
                <h3>{project.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Client: {project.client}
                </p>
                <p>{project.summary}</p>
              </div>
              <span className="view-more">View Case Study ➔</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER & CONTACT */}
      <footer id="contact" className="footer">
        <h2>Let's Connect</h2>
        <p>Ready to collaborate and craft high-converting brand stories together!</p>
        <div className="contact__social">
          <a href={`mailto:${PORTFOLIO_DATA.personalInfo.email}`} className="contact__social-link">
            ✉️ {PORTFOLIO_DATA.personalInfo.email}
          </a>
          <a href={`tel:${PORTFOLIO_DATA.personalInfo.phone}`} className="contact__social-link">
            📞 {PORTFOLIO_DATA.personalInfo.phone}
          </a>
          <a href={PORTFOLIO_DATA.personalInfo.linkedin} target="_blank" rel="noreferrer" className="contact__social-link">
            🔗 LinkedIn Profile
          </a>
        </div>
      </footer>

      {/* POPUP MODAL (CASE STUDY DETAILS) */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>×</button>
            
            <span className="category-tag">{selectedProject.category}</span>
            <h3 className="modal-title">{selectedProject.title}</h3>
            
            <div className="modal-info-group">
              <p><strong>Client / Brand:</strong> {selectedProject.client}</p>
              {selectedProject.hashtags && <p><strong>Key Hashtags:</strong> {selectedProject.hashtags}</p>}
            </div>

            <div className="modal-description">
              <h4 style={{ color: '#2e7d32', marginBottom: '0.4rem' }}>🎯 My Role:</h4>
              <p style={{ marginBottom: '1rem' }}>{selectedProject.role}</p>

              <h4 style={{ color: '#2e7d32', marginBottom: '0.4rem' }}>📦 Key Outcomes:</h4>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                {selectedProject.outcomes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h4 style={{ color: '#2e7d32', marginBottom: '0.4rem' }}>📈 Overall Results & Impact:</h4>
              <p style={{ background: '#f0f7f2', padding: '0.8rem', borderRadius: '8px', color: '#1b5e20', fontWeight: '500' }}>
                {selectedProject.results}
              </p>

              {selectedProject.links && selectedProject.links.length > 0 && (
                <div style={{ marginTop: '1.2rem' }}>
                  <h4 style={{ color: '#2e7d32', marginBottom: '0.4rem' }}>🔗 Media & Reference Links:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          fontSize: '0.85rem',
                          background: '#e3f2fd',
                          color: '#1565c0',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        {link.name} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button 
                className="btn-primary-modal" 
                onClick={() => setSelectedProject(null)}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}