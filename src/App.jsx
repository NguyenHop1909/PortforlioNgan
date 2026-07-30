import React, { useState } from 'react';
import './App.css';


const AVATAR_URL = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
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
        <div className="content-portfolio">
            {/* NAVIGATION */}
            <nav className="nav-bar">
                <div className="nav-logo">{PORTFOLIO_DATA.personalInfo.nickname} ✦</div>
                <div className="nav-links">
                    <a href="#about">About</a>
                    <a href="#expertise">Expertise</a>
                    <a href="#works">Selected Works</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>

            {/* HERO SECTION WITH AVATAR */}
            <header className="hero-section">
                {/* KHU VỰC ẢNH ĐẠI DIỆN */}
                <div className="avatar-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                        alt="Avatar"
                        className="user-avatar"
                    />
                </div>

                <span className="hero-badge">EDITORIAL & CONTENT PORTFOLIO</span>
                <h1 className="hero-title">{PORTFOLIO_DATA.personalInfo.name}</h1>
                <p className="hero-subtitle">{PORTFOLIO_DATA.personalInfo.role}</p>

                <blockquote className="hero-quote">
                    "{PORTFOLIO_DATA.personalInfo.bio}"
                </blockquote>
            </header>

            {/* ABOUT & STATS */}
            <section id="about" className="section-container">
                <div className="editorial-grid">
                    <div className="editorial-col">
                        <h2 className="section-heading">Industries Covered</h2>
                        <div className="tag-cloud">
                            {PORTFOLIO_DATA.personalInfo.fields.map((field, i) => (
                                <span key={i} className="field-tag">{field}</span>
                            ))}
                        </div>
                    </div>
                    <div className="editorial-col highlight-box">
                        <span className="stat-number">3,600+</span>
                        <p className="stat-label">Successful Deliverables & Project Outcomes Across 2+ Years</p>
                    </div>
                </div>
            </section>

            {/* EXPERTISE */}
            <section id="expertise" className="section-container bg-light">
                <h2 className="section-heading">Core Expertise</h2>
                <div className="expertise-grid">
                    {PORTFOLIO_DATA.skills.map((skill, idx) => (
                        <div key={idx} className="expertise-card">
                            <span className="expertise-num">0{idx + 1}</span>
                            <h3>{skill.name}</h3>
                            <p>{skill.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SELECTED WORKS */}
            <section id="works" className="section-container">
                <div className="section-header">
                    <h2 className="section-heading">Featured Works</h2>
                    <span className="section-subtext">Click any case study to explore deep dives</span>
                </div>

                <div className="works-list">
                    {PORTFOLIO_DATA.projects.map((project) => (
                        <article
                            key={project.id}
                            className="work-item"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="work-meta">
                                <span className="work-category">{project.category}</span>
                                <span className="work-client">{project.client}</span>
                            </div>
                            <h3 className="work-title">{project.title}</h3>
                            <p className="work-summary">{project.summary}</p>
                            <div className="work-action">Read Case Study ⟶</div>
                        </article>
                    ))}
                </div>
            </section>

            {/* FOOTER / CONTACT */}
            <footer id="contact" className="footer-section">
                <h2>Let's Craft Meaningful Stories Together</h2>
                <p>Available for freelance projects, content strategy, and creative collaborations.</p>
                <div className="footer-links">
                    <a href={`mailto:${PORTFOLIO_DATA.personalInfo.email}`}>✉️ {PORTFOLIO_DATA.personalInfo.email}</a>
                    <a href={`tel:${PORTFOLIO_DATA.personalInfo.phone}`}>📞 {PORTFOLIO_DATA.personalInfo.phone}</a>
                    <a href={PORTFOLIO_DATA.personalInfo.linkedin} target="_blank" rel="noreferrer">🔗 LinkedIn</a>
                </div>
            </footer>

            {/* POPUP MODAL (Sticky Close Button) */}
            {selectedProject && (
                <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                        {/* STICKY CLOSE BUTTON */}
                        <button className="sticky-close-btn" onClick={() => setSelectedProject(null)}>
                            ×
                        </button>

                        {/* SCROLLABLE BODY */}
                        <div className="modal-scroll-body">
                            <span className="work-category">{selectedProject.category}</span>
                            <h2 className="modal-headline">{selectedProject.title}</h2>
                            <p className="modal-client-name"><strong>Client:</strong> {selectedProject.client}</p>

                            <hr className="divider" />

                            <div className="modal-section">
                                <h4>🎯 Strategic Role</h4>
                                <p>{selectedProject.role}</p>
                            </div>

                            <div className="modal-section">
                                <h4>📦 Scope of Deliverables</h4>
                                <ul>
                                    {selectedProject.outcomes.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-section highlight-impact">
                                <h4>📈 Campaign Impact & Results</h4>
                                <p>{selectedProject.results}</p>
                            </div>

                            {selectedProject.links && selectedProject.links.length > 0 && (
                                <div className="modal-section">
                                    <h4>🔗 Press & Media References</h4>
                                    <div className="link-pills">
                                        {selectedProject.links.map((link, idx) => (
                                            <a key={idx} href={link.url} target="_blank" rel="noreferrer">
                                                {link.name} ↗
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}