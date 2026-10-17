"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, ArrowRight, Github, Linkedin, Mail, ExternalLink,
  Terminal, Cpu, ShieldCheck, BrainCircuit, AudioLines, Network, Sparkles, Code2,
  Search, X, FlaskConical, Layers3, Globe2, GitFork, Star, Clock3, GraduationCap
} from "lucide-react";

type Project = {
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  category: "Research" | "AI Systems" | "Products" | "Edge AI" | "Developer Tools";
  github: string;
  demo?: string;
  featured?: boolean;
  mark: string;
  accent: string;
};

const projects: Project[] = [
  {
    title: "PromptShield",
    eyebrow: "AI SECURITY · PROMPT INJECTION",
    description: "An LLM security gateway that scores incoming prompts, flags injection patterns, highlights risky spans, and blocks high-risk requests before they reach a model.",
    tags: ["Python", "FastAPI", "scikit-learn", "Next.js", "LLM Security"],
    category: "Research",
    github: "https://github.com/VIKSIT-GARG/prompt-shield",
    featured: true, mark: "PS", accent: "mint"
  },
  {
    title: "SemPointer",
    eyebrow: "RESEARCH · SEMANTIC MEMORY",
    description: "A random-access semantic memory approach for LLMs, with reproducible evaluation against full-context, RAG, BM25, and other baselines.",
    tags: ["PyTorch", "CUDA", "Benchmarking", "RAG", "LLMs"],
    category: "Research",
    github: "https://github.com/VIKSIT-GARG/Sempointer",
    featured: true, mark: "Σ", accent: "violet"
  },
  {
    title: "BeforeCall",
    eyebrow: "PRODUCT · MEETING INTELLIGENCE",
    description: "Walk into meetings prepared: gather attendee and company context, generate evidence-backed briefs, and separate facts from inference and suggestions.",
    tags: ["Next.js", "TypeScript", "Prisma", "Tavily", "Ollama"],
    category: "Products",
    github: "https://github.com/VIKSIT-GARG/BeforeCall",
    demo: "https://beforecall.vercel.app/",
    featured: true, mark: "BC", accent: "blue"
  },
  {
    title: "Food Traceability Graph",
    eyebrow: "GRAPH SYSTEMS · RECALL INTELLIGENCE",
    description: "A Neo4j-backed recall console that traces flagged ingredient batches through kitchens, dishes, orders, and downstream exposure.",
    tags: ["Neo4j", "Cypher", "FastAPI", "Cytoscape.js", "Python"],
    category: "AI Systems",
    github: "https://github.com/VIKSIT-GARG/food-traceability-graph",
    demo: "https://food-traceability-demo.onrender.com/",
    featured: true, mark: "FG", accent: "orange"
  },
  {
    title: "NOVA — Edge Wake Word",
    eyebrow: "EDGE AI · VOICE ACTIVATION",
    description: "An offline keyword-spotting pipeline for the NOVA wake word, targeting ESP32 hardware with a lightweight model and a remote ASR handoff.",
    tags: ["TensorFlow", "TFLite Micro", "ESP32", "I2S", "Vosk"],
    category: "Edge AI",
    github: "https://github.com/VIKSIT-GARG/NOWA-KWS",
    mark: "NV", accent: "mint"
  },
  {
    title: "Talk2Car VLM",
    eyebrow: "COMPUTER VISION · VLM",
    description: "A vision-language project exploring grounded interaction with vehicles and visual context.",
    tags: ["Vision-Language Models", "Python", "Computer Vision"],
    category: "Research",
    github: "https://github.com/VIKSIT-GARG/talk2car-ai_VLM",
    mark: "VLM", accent: "violet"
  },
  {
    title: "Mini MCP Memory Server",
    eyebrow: "DEVELOPER TOOLS · MEMORY",
    description: "A compact memory-server project exploring reusable context and tool-mediated workflows for AI applications.",
    tags: ["MCP", "TypeScript", "AI Agents"],
    category: "Developer Tools",
    github: "https://github.com/VIKSIT-GARG/Mini_mcp_memory_Server",
    mark: "MCP", accent: "blue"
  },
  {
    title: "SplitPe",
    eyebrow: "FINTECH · FLUTTER",
    description: "A UPI bill-splitting concept with group expense flows, QR scanning, share links, and a CRED NeoPOP-inspired interface. Experimental proof of concept.",
    tags: ["Flutter", "Dart", "UPI", "QR", "Mobile"],
    category: "Products",
    github: "https://github.com/VIKSIT-GARG/SplitPe",
    demo: "https://viksit-garg.github.io/SplitPe/",
    mark: "₹", accent: "orange"
  },
  {
    title: "SurgeScout",
    eyebrow: "DATA · DECISION SUPPORT",
    description: "A project focused on surfacing useful signals from data and turning them into an actionable interface.",
    tags: ["AI/ML", "Data", "Web"],
    category: "AI Systems",
    github: "https://github.com/VIKSIT-GARG/SurgeScout",
    mark: "SS", accent: "violet"
  },
  {
    title: "CachyOS Glass Git",
    eyebrow: "OPEN SOURCE · LINUX",
    description: "Personal CachyOS desktop configuration and ricing setup, reflecting a hands-on interest in Linux environments and developer tooling.",
    tags: ["CachyOS", "Linux", "Shell", "Desktop"],
    category: "Developer Tools",
    github: "https://github.com/VIKSIT-GARG/CachyOS-Rice-glassGit",
    mark: "⌘", accent: "mint"
  }
];

const filters = ["All", "Research", "AI Systems", "Products", "Edge AI", "Developer Tools"] as const;

function LinkButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return <a href={href} target="_blank" rel="noreferrer" className={primary ? "button button-primary" : "button button-ghost"}>{children}</a>;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const categoryMatch = filter === "All" || project.category === filter;
    const needle = query.trim().toLowerCase();
    const textMatch = !needle || [project.title, project.description, project.eyebrow, ...project.tags].join(" ").toLowerCase().includes(needle);
    return categoryMatch && textMatch;
  }), [filter, query]);

  return (
    <main className="portfolio-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Viksit Garg home"><span className="brand-mark">vg.</span><span>Viksit Garg</span></a>
        <div className="nav-links">
          <a href="#work">Work</a><a href="#about">About</a><a href="#approach">Approach</a>
        </div>
        <a className="availability" href="mailto:viksitg427@gmail.com"><span className="status-dot" />Let’s talk <ArrowUpRight size={14} /></a>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="kicker"><span className="kicker-line" />AI/ML ENGINEER IN THE MAKING <span className="kicker-dot">✳</span></div>
          <h1>I build things<br />that make <span className="gradient-word">AI useful.</span></h1>
          <p className="hero-text">I’m Viksit — an AI/ML student exploring the space between <strong>research, intelligent systems, and products people can actually use.</strong> I care about making models more useful, safer, and more efficient.</p>
          <div className="hero-actions">
            <a href="#work" className="button button-primary">Explore my work <ArrowDownRight size={16} /></a>
            <LinkButton href="https://github.com/VIKSIT-GARG"><Github size={16} /> GitHub profile</LinkButton>
          </div>
          <div className="hero-meta">
            <div className="avatar"><img src="https://avatars.githubusercontent.com/u/184533486?v=4" alt="Viksit Garg GitHub avatar" /></div>
            <div><strong>Viksit Garg</strong><span>3rd-year AI & ML student</span></div>
            <span className="meta-divider" />
            <span className="mono">@VIKSIT-GARG</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-top"><span><span className="live-pulse" /> CURRENTLY EXPLORING</span><span className="mono">0x01 — 0x∞</span></div>
          <div className="orbit-scene">
            <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
            <div className="orbit-node node-a"><ShieldCheck size={18} /></div>
            <div className="orbit-node node-b"><BrainCircuit size={18} /></div>
            <div className="orbit-node node-c"><AudioLines size={18} /></div>
            <div className="core"><span className="core-spark"><Sparkles size={22} /></span><span className="core-label">MAKE IT<br /><b>INTELLIGENT</b></span><span className="core-sub">research → reality</span></div>
          </div>
          <div className="visual-caption"><span className="caption-index">01 / 03</span><p>From <em>“what if?”</em> to<br />something that works.</p><ArrowUpRight size={18} /></div>
          <div className="visual-grid" />
        </div>
      </section>

      <section className="signal-strip" aria-label="Areas of focus">
        <div className="signal-label">THE SIGNAL</div>
        <div><ShieldCheck size={16} /><span>AI Safety</span></div>
        <div><BrainCircuit size={16} /><span>LLM Systems</span></div>
        <div><FlaskConical size={16} /><span>Applied Research</span></div>
        <div><AudioLines size={16} /><span>Edge AI</span></div>
        <div><Network size={16} /><span>Agents & Memory</span></div>
      </section>

      <section id="work" className="work-section">
        <div className="section-head">
          <div><div className="section-kicker">SELECTED WORK <span>— 2024 / NOW</span></div><h2>Proof of <span className="serif-italic">curiosity.</span></h2><p className="section-sub">A selection of experiments, research, and products. Some are shipped, some are still being sharpened.</p></div>
          <a className="text-link" href="https://github.com/VIKSIT-GARG?tab=repositories" target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={15} /></a>
        </div>

        <div className="filter-bar">
          <div className="filter-pills">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "filter-pill active" : "filter-pill"}>{item}</button>)}</div>
          <label className="project-search"><Search size={15} /><input aria-label="Search projects" placeholder="Find a project..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label>
        </div>

        <div className="projects-grid">
          {visibleProjects.map((project, index) => <article className={"project-card accent-" + project.accent} key={project.title}>
            <div className="project-card-top"><span className="project-number">{String(index + 1).padStart(2, "0")}</span><span className="project-eyebrow">{project.eyebrow}</span><a href={project.github} target="_blank" rel="noreferrer" aria-label={"Open " + project.title + " repository"} className="project-github"><Github size={16} /></a></div>
            <div className="project-mark">{project.mark}<span className="mark-orbit" /></div>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <div className="project-card-bottom"><span className="category-label"><span />{project.category}</span><div className="project-links"><a href={project.github} target="_blank" rel="noreferrer">Source <ArrowUpRight size={13} /></a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={12} /></a>}</div></div>
          </article>)}
          {visibleProjects.length === 0 && <div className="empty-state"><Search size={22} /><h3>No matching projects</h3><p>Try another term or switch the category filter.</p><button onClick={() => { setQuery(""); setFilter("All"); }}>Reset filters</button></div>}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-left"><div className="section-kicker">A LITTLE CONTEXT</div><h2>Research-minded.<br /><span className="serif-italic">Builder at heart.</span></h2><p>I’m a third-year AI/ML student who likes going one layer deeper: understanding how a system behaves, where it breaks, and how to turn an idea into something someone can try.</p><p>During a research internship at DRDO, I worked around vision-language model evaluation, datasets, training workflows, and research literature. Outside that, I build across AI security, memory systems, graph applications, and edge devices.</p><a className="text-link" href="https://linkedin.com/in/viksit-garg" target="_blank" rel="noreferrer">More on LinkedIn <ArrowUpRight size={15} /></a></div>
        <div className="timeline">
          <div className="timeline-item"><div className="timeline-marker"><FlaskConical size={16} /></div><div><span className="timeline-time">RESEARCH EXPERIENCE</span><h3>Research Intern · DRDO</h3><p>Vision-language model evaluation, dataset workflows, training, and reading research papers.</p></div></div>
          <div className="timeline-item"><div className="timeline-marker"><GraduationCap size={16} /></div><div><span className="timeline-time">CURRENTLY</span><h3>AI & ML · Year 3</h3><p>Balancing fundamentals with experiments that move beyond notebooks and into usable systems.</p></div></div>
          <div className="timeline-item"><div className="timeline-marker"><Terminal size={16} /></div><div><span className="timeline-time">ALWAYS IN PROGRESS</span><h3>Open-source tinkering</h3><p>Local inference, Linux, model efficiency, agent workflows, and the occasional late-night build.</p></div></div>
        </div>
      </section>

      <section id="approach" className="approach-section">
        <div><div className="section-kicker">HOW I LIKE TO WORK</div><h2>Build with intent.<br /><span className="serif-italic">Measure what matters.</span></h2></div>
        <div className="approach-cards">
          <article><span className="approach-icon"><FlaskConical size={18} /></span><span className="approach-no">01</span><h3>Research before hype</h3><p>I want the baseline, the failure modes, and the honest result — not just a polished demo.</p></article>
          <article><span className="approach-icon"><Layers3 size={18} /></span><span className="approach-no">02</span><h3>Systems over snippets</h3><p>Model, API, interface, evaluation, and deployment all matter when the goal is a usable tool.</p></article>
          <article><span className="approach-icon"><Cpu size={18} /></span><span className="approach-no">03</span><h3>Efficiency is a feature</h3><p>Latency, memory, cost, and safety shape whether an AI system is useful in the real world.</p></article>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-orb"><Mail size={22} /></div><div><div className="section-kicker">HAVE A GOOD PROBLEM?</div><h2>Let’s make something <span className="serif-italic">real.</span></h2><p>Open to thoughtful collaborations, research conversations, and interesting engineering challenges.</p></div><a href="mailto:viksitg427@gmail.com" className="button button-primary">Say hello <ArrowUpRight size={16} /></a>
      </section>

      <footer className="footer"><a className="brand" href="#top"><span className="brand-mark">vg.</span><span>Viksit Garg</span></a><span>Built with curiosity <span className="footer-star">✳</span> and a suspicious number of tabs.</span><div><a href="https://github.com/VIKSIT-GARG" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://linkedin.com/in/viksit-garg" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="mailto:viksitg427@gmail.com" aria-label="Email"><Mail size={17} /></a></div></footer>
    </main>
  );
}
