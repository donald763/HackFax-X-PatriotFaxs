"use client";

import React, { useState, useEffect, useRef } from "react";

const C = {
  bg: "#fafdf7",
  surface: "#f1f7ec",
  surfaceAlt: "#e8f0e0",
  white: "#ffffff",
  border: "rgba(30,80,30,0.1)",
  borderHover: "rgba(30,80,30,0.22)",
  text: "#1a2e1a",
  textMuted: "#5a7a5a",
  textDim: "#8aaa8a",
  accent: "#22883a",
  accentLight: "#2da34a",
  accentGlow: "rgba(34,136,58,0.12)",
  green100: "#dcf5e0",
  green200: "#b8ebc2",
  dark: "#162016",
};

const fontLink = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap";
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useInView<T extends HTMLElement>(t = 0.12) {
  const ref = useRef<T | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [ref, v] as const;
}

type CounterProps = {
  end: number;
  suffix?: string;
  duration?: number;
};

function Counter({ end, suffix = "", duration = 2000 }: CounterProps) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView<HTMLSpanElement>(0.3);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => { s += step; if (s >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(s)); }, 16);
    return () => clearInterval(id);
  }, [inView, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

type FadeProps = {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  delay?: number;
};

function Fade({ children, id, style = {}, delay = 0 }: FadeProps) {
  const [ref, v] = useInView<HTMLElement>(0.08);
  return (
    <section id={id} ref={ref} style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>{children}</section>
  );
}

// Icons
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const Leaf = () => <svg width="16" height="16" viewBox="0 0 24 24" fill={C.accent} stroke="none"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>;
const Arrow = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Play = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Check = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.green100} stroke={C.accent} strokeWidth="1.5"/><polyline points="8 12 11 15 16 9" stroke={C.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Star = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const ICONS = {
  brain: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 .9-.3 1.7-.7 2.4A5 5 0 0 1 19 14a5 5 0 0 1-3 4.6V22h-4v-3.4A5 5 0 0 1 9 14a5 5 0 0 1 2.7-4.6A5 5 0 0 1 12 2z"/><path d="M12 2v6"/><path d="M9 10h6"/></svg>,
  tree: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8"/><path d="M5 12l7-8 7 8"/><path d="M3 17l9-6 9 6"/></svg>,
  target: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  zap: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  play: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
} as const;

type Feature = {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
};

const features: Feature[] = [
  { icon: "brain", title: "Adaptive AI Tutor", desc: "Understands your learning style and adapts difficulty, pacing, and explanations in real-time." },
  { icon: "tree", title: "Knowledge Trees", desc: "Visualize prerequisites, current topics, and what comes next in beautiful interactive maps." },
  { icon: "target", title: "Practice Problems", desc: "AI-generated problems targeting weak areas with instant feedback and step-by-step solutions." },
  { icon: "zap", title: "Real-time Sessions", desc: "Track focus time, accuracy, and problem-solving speed live during every study session." },
  { icon: "play", title: "Video Lessons", desc: "AI-curated videos with smart timestamps, auto summaries, and key concept extraction." },
  { icon: "chart", title: "Progress Analytics", desc: "Detailed analytics revealing patterns, strengths, and areas for improvement." },
];

const testimonials = [
  { name: "Sarah K.", role: "Pre-Med Student", quote: "CoursAI transformed how I study for organic chemistry. The knowledge tree helped me see connections I was missing. My grade went from a C+ to an A-.", av: "SK", bg: "#22883a" },
  { name: "Marcus T.", role: "Software Engineer", quote: "The real-time workout tracker keeps me accountable. I can see exactly how productive each session is and the AI adjusts problems to match my level.", av: "MT", bg: "#2da34a" },
  { name: "Priya R.", role: "High School Senior", quote: "I used CoursAI to prep for AP exams and got 5s in both Calc BC and Physics. The practice problems are ridiculously good at finding weak spots.", av: "PR", bg: "#1a6e2e" },
];

const navLinks = [
  { label: "Features", id: "features" },
  { label: "Knowledge", id: "knowledge" },
  { label: "Tracker", id: "workout" },
  { label: "Results", id: "testimonials" },
] as const;

const knowledgeLines = [
  [200, 45, 115, 130],
  [200, 45, 285, 130],
  [115, 130, 70, 225],
  [115, 130, 155, 225],
  [285, 130, 240, 225],
  [285, 130, 325, 225],
] as const;

const knowledgeNodes = [
  { cx: 200, cy: 45, r: 22, label: "Root" },
  { cx: 115, cy: 130, r: 16, label: "Math" },
  { cx: 285, cy: 130, r: 16, label: "CS" },
  { cx: 70, cy: 225, r: 12, label: "Alg" },
  { cx: 155, cy: 225, r: 12, label: "Calc" },
  { cx: 240, cy: 225, r: 12, label: "DS" },
  { cx: 325, cy: 225, r: 12, label: "ML" },
] as const;

const footerColumns = [
  { title: "Product", links: ["Features", "Knowledge Trees", "Workout Tracker", "Pricing"] },
  { title: "Resources", links: ["Blog", "Documentation", "API", "Community"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Privacy"] },
] as const;

const socialLinks = ["Twitter", "Discord", "YouTube", "GitHub"] as const;

const h2Style: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em", color: C.text, margin: 0, lineHeight: 1.1 };

type BtnProps = {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
};

function Btn({ children, primary = false, onClick, style = {} }: BtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 34px", borderRadius: 100, fontWeight: 600, fontSize: 16, cursor: "pointer", fontFamily: "inherit",
        display: "inline-flex", alignItems: "center", gap: 10, transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        transform: hov ? "scale(1.05)" : "scale(1)",
        ...(primary ? {
          background: C.accent, color: "#fff", border: "none",
          boxShadow: hov ? `0 10px 40px rgba(34,136,58,0.2)` : `0 6px 30px ${C.accentGlow}`,
        } : {
          background: C.white, color: C.text, border: `1.5px solid ${hov ? C.borderHover : C.border}`,
          boxShadow: hov ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
        }),
        ...style,
      }}
    >{children}</button>
  );
}

type CardProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

function Card({ children, style = {} }: CardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, border: `1.5px solid ${hov ? C.accent + "40" : C.border}`, background: C.white,
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 16px 48px rgba(34,136,58,0.08)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

type LandingPageProps = {
  onComplete?: () => void;
};

export function LandingPage({ onComplete }: LandingPageProps) {
  const [navSolid, setNavSolid] = useState(false);
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
      return;
    }
    scrollTo("cta");
  };

  useEffect(() => {
    const fn = () => setNavSolid(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <link href={fontLink} rel="stylesheet" />

      {/* ═══ NAV ═══ */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", padding: "14px 16px 0" }}>
        <nav style={{
          width: "100%", maxWidth: 920, borderRadius: 22, padding: "10px 24px",
          background: navSolid ? "rgba(250,253,247,0.9)" : "rgba(250,253,247,0.5)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${navSolid ? C.border : "transparent"}`,
          boxShadow: navSolid ? "0 4px 30px rgba(0,0,0,0.06)" : "none",
          display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 14px ${C.accentGlow}` }}>
              <BookIcon />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>CoursAI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500 }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{ cursor: "pointer", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <Btn primary onClick={handleComplete} style={{ padding: "9px 22px", fontSize: 14 }}>Get Started</Btn>
        </nav>
      </div>

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow}, transparent 65%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,136,58,0.06), transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: `radial-gradient(circle, ${C.accent}22 1px, transparent 1px)`, backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 50% 45% at 50% 40%, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 50% 45% at 50% 40%, black 20%, transparent 70%)" }} />

        {[{ top: "18%", left: "8%", r: -30, s: 1 }, { top: "25%", right: "10%", r: 45, s: 0.8 }, { top: "70%", left: "12%", r: 20, s: 0.6 }, { top: "65%", right: "15%", r: -15, s: 0.7 }].map((l, i) => (
          <div key={i} style={{ position: "absolute", top: l.top, left: l.left, right: l.right, transform: `rotate(${l.r}deg) scale(${l.s})`, opacity: 0.12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill={C.accent}><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>
          </div>
        ))}

        <div style={{ position: "relative", zIndex: 10, maxWidth: 860, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, background: C.green100, border: `1px solid ${C.green200}`, marginBottom: 32, fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: "0.06em" }}>
            <Leaf /> AI-POWERED LEARNING PLATFORM
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px, 7.5vw, 88px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}>
            Master any subject<br /><span style={{ color: C.accent, fontStyle: "italic" }}>with your AI tutor</span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: C.textMuted, maxWidth: 580, margin: "28px auto 0", lineHeight: 1.75 }}>
            Personalized knowledge trees, real-time session tracking, and adaptive practice problems — all powered by AI that learns how you learn.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }}>
            <Btn primary onClick={handleComplete}>Start Learning Free <Arrow /></Btn>
            <Btn onClick={() => scrollTo("features")}><span style={{ color: C.accent }}><Play /></span> See How It Works</Btn>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, marginTop: 72, flexWrap: "wrap" }}>
            {[["50K+", "Active Learners"], ["94%", "Improvement Rate"], ["200+", "Topics Available"]].map(([n, l], i, a) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</div>
                  <div style={{ fontSize: 13, color: C.textDim, marginTop: 4, fontWeight: 500 }}>{l}</div>
                </div>
                {i < a.length - 1 && <div style={{ width: 1, height: 36, background: C.border }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <Fade id="features" style={{ padding: "110px 24px", background: C.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 14 }}>Core Features</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(34px, 4.5vw, 52px)" }}>Everything you need to excel</h2>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "14px auto 0" }}>A complete AI-powered learning ecosystem designed around how you learn best.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {features.map((f, i) => (
              <Card key={i} style={{ padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.green100, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{ICONS[f.icon]}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Fade>

      {/* ═══ KNOWLEDGE TREES ═══ */}
      <Fade id="knowledge" style={{ padding: "110px 24px", background: C.surface }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ marginBottom: 56, maxWidth: 540 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 14 }}>Knowledge Trees</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(30px, 4vw, 48px)" }}>See the full picture of what you need to learn</h2>
            <p style={{ fontSize: 16, color: C.textMuted, marginTop: 14, lineHeight: 1.75 }}>Our AI builds interactive knowledge trees showing every concept, prerequisite, and connection.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: 20, border: `1.5px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.04)" }}>
              <svg viewBox="0 0 400 300" style={{ width: "80%", height: "80%" }}>
                {knowledgeLines.map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.green200} strokeWidth="2.5" strokeDasharray="6 3" />
                ))}
                {knowledgeNodes.map((node, i) => (
                  <g key={node.label}>
                    <circle cx={node.cx} cy={node.cy} r={node.r} fill={i === 0 ? C.accent : C.green100} stroke={C.accent} strokeWidth="2">
                      <animate attributeName="r" values={`${node.r};${node.r + 1.5};${node.r}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite"/>
                    </circle>
                    <text x={node.cx} y={node.cy + 4} textAnchor="middle" fill={i === 0 ? "#fff" : C.accent} fontSize={i === 0 ? "9" : "8"} fontWeight="600" fontFamily="Outfit">{node.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {["AI maps out prerequisites and dependencies between topics", "See exactly which skills you need before advancing", "Track mastery level for each node in the tree", "Get personalized learning path recommendations", "Unlock new topics as you demonstrate proficiency"].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}><Check /></div>
                    <span style={{ fontSize: 15, lineHeight: 1.65, color: C.text }}>{f}</span>
                  </div>
                ))}
              </div>
              <Btn primary onClick={() => scrollTo("cta")} style={{ marginTop: 36, padding: "13px 26px", fontSize: 14 }}>Explore Knowledge Trees <Arrow /></Btn>
            </div>
          </div>
        </div>
      </Fade>

      {/* ═══ VIDEO & PRACTICE ═══ */}
      <Fade style={{ padding: "110px 24px", background: C.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 14 }}>Video Lessons & Practice</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(30px, 4.5vw, 48px)" }}>Learn by watching. Master by doing.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${C.green100}, ${C.surfaceAlt})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: `0 6px 30px ${C.accentGlow}` }}><Play /></div>
                <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 8 }}>
                  {["Smart Timestamps", "Auto Summaries", "Ask AI"].map(t => (
                    <span key={t} style={{ padding: "5px 12px", borderRadius: 100, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", fontSize: 11, fontWeight: 600, color: C.accent }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: 28 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>Video Lessons</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>AI-curated video library with smart timestamps, auto-generated summaries, and key concept extraction.</p>
              </div>
            </Card>

            <Card style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${C.surface}, ${C.green100})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
                <div style={{ width: "100%", maxWidth: 300, background: C.white, borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 22, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Problem #42</div>
                  <div style={{ fontSize: 14, marginBottom: 14, lineHeight: 1.5 }}>Find the derivative of f(x) = 3x² + 2x − 7</div>
                  {["f'(x) = 6x + 2", "f'(x) = 3x + 2", "f'(x) = 6x − 7"].map((o, i) => (
                    <div key={i} style={{ padding: "9px 14px", borderRadius: 10, marginBottom: i < 2 ? 7 : 0, border: `1.5px solid ${i===0 ? C.accent+"50" : C.border}`, background: i===0 ? C.green100 : "transparent", fontSize: 13, color: i===0 ? C.accent : C.textMuted, fontWeight: i===0 ? 600 : 400 }}>
                      {o}{i===0 && " ✓"}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 28 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>Adaptive Practice</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>AI-generated problems that target your weak areas with step-by-step solutions and hints.</p>
                <div style={{ display: "flex", gap: 28, marginTop: 18 }}>
                  {[["10K+","Problems"],["50+","Subjects"],["AI","Hints"]].map(([v,l],i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: C.accent }}>{v}</div>
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, fontWeight: 500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Fade>

      {/* ═══ WORKOUT TRACKER (Dark section for contrast) ═══ */}
      <Fade id="workout" style={{ padding: "110px 24px", background: C.dark }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accentLight, marginBottom: 14 }}>Real-time Workout Tracker</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 400, letterSpacing: "-0.02em", margin: 0, color: "#fff", lineHeight: 1.1 }}>Track every session in real-time</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "14px auto 0", lineHeight: 1.7 }}>Like a fitness tracker for your brain. Monitor focus, accuracy, and speed.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }}>
            {[["Avg. Session","2h 15m","+12%"],["Problems Solved","1,247","+24%"],["Day Streak","34","Best: 52"],["Accuracy","87%","+6%"]].map(([l,v,ch],i) => (
              <div key={i} style={{ padding: 26, borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 10, fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.accentLight, marginTop: 6 }}>{ch}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[["Focus Timer","Pomodoro-style sessions with AI-optimized break schedules based on your performance."],["Live Accuracy","See accuracy update in real-time as you work. AI adjusts difficulty accordingly."],["Session Reports","Detailed breakdown of what you covered, where you struggled, and what to review."]].map(([t,d],i) => (
              <div key={i} style={{ padding: 26, borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#fff" }}>{t}</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Fade>

      {/* ═══ TESTIMONIALS ═══ */}
      <Fade id="testimonials" style={{ padding: "110px 24px", background: C.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 14 }}>Student Results</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(30px, 4.5vw, 48px)" }}>Real students, real results</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {testimonials.map((t, i) => (
              <Card key={i} style={{ padding: 30, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>{Array.from({length:5}).map((_,j) => <Star key={j}/>)}</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, flex: 1, margin: 0 }}>"{t.quote}"</p>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{t.av}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textDim }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Fade>

      {/* ═══ QUOTE ═══ */}
      <Fade style={{ padding: "90px 24px", background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.2vw, 36px)", fontWeight: 400, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
            "CoursAI is built for the learners who refuse to settle. Whether you're preparing for exams, switching careers, or simply curious — your AI tutor is ready when you are."
          </p>
        </div>
      </Fade>

      {/* ═══ STATS ═══ */}
      <Fade style={{ padding: "90px 24px", background: C.white }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
          {[{v:50,s:"K+",l:"Active Learners"},{v:2,s:"M+",l:"Problems Generated"},{v:94,s:"%",l:"Improvement Rate"},{v:80,s:"+",l:"Countries"}].map((s,i) => (
            <div key={i}>
              <div style={{ fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.accent }}><Counter end={s.v} suffix={s.s}/></div>
              <div style={{ fontSize: 13, color: C.textDim, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Fade>

      {/* ═══ CTA ═══ */}
      <Fade id="cta" style={{ padding: "110px 24px", background: C.surface }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto 28px", boxShadow: `0 8px 30px ${C.accentGlow}` }}>
            {ICONS.brain}
          </div>
          <h2 style={{ ...h2Style, fontSize: "clamp(34px, 5vw, 56px)" }}>Ready to learn smarter?</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>Start with a free account. Build your first knowledge tree, take a practice session, and experience AI tutoring that works.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <Btn primary onClick={handleComplete}>Get Started Free <Arrow /></Btn>
            <Btn>View Pricing</Btn>
          </div>
          <p style={{ fontSize: 13, color: C.textDim, marginTop: 22 }}>No credit card required. Free plan includes 5 sessions/week.</p>
        </div>
      </Fade>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: C.dark, padding: "56px 24px 40px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><BookIcon /></div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>CoursAI</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260 }}>The ultimate AI tutor. Master any subject with personalized knowledge trees, real-time tracking, and adaptive practice.</p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 18, color: "rgba(255,255,255,0.7)" }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1080, margin: "40px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2026 CoursAI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {socialLinks.map((s) => (
              <a
                key={s}
                href="#"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;