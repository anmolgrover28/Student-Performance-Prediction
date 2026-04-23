import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoMark from '../components/LogoMark';

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const features = [
  {
    title: 'Ensemble ML pipeline',
    desc: 'Random Forest classifier with calibrated pass probability — trained and served via a dedicated FastAPI microservice.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
    ),
    wrap: 'from-violet-600/40 to-indigo-600/20 ring-violet-500/20',
    fg: 'text-violet-200',
  },
  {
    title: 'Full-stack & secure',
    desc: 'JWT auth, bcrypt passwords, and MongoDB persistence — predictions tied to your account with a clean REST API.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    ),
    wrap: 'from-emerald-600/35 to-cyan-600/20 ring-emerald-500/20',
    fg: 'text-emerald-200',
  },
  {
    title: 'Insightful dashboard',
    desc: 'Interactive charts, history table, and rolling averages so you can see how your estimated outcomes evolve over time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    ),
    wrap: 'from-fuchsia-600/35 to-pink-600/20 ring-fuchsia-500/20',
    fg: 'text-fuchsia-200',
  },
];

const stack = [
  { name: 'React', sub: 'UI' },
  { name: 'Vite', sub: 'Build' },
  { name: 'Node.js', sub: 'API' },
  { name: 'MongoDB', sub: 'Data' },
  { name: 'FastAPI', sub: 'ML' },
  { name: 'scikit-learn', sub: 'Models' },
];

const steps = [
  { n: '01', t: 'Sign up', d: 'Create a secure account — your session uses signed JWT tokens.' },
  { n: '02', t: 'Tune inputs', d: 'Drag sliders for attendance, marks, study hours, and prior performance.' },
  { n: '03', t: 'Model inference', d: 'Backend forwards features to Python; Random Forest returns pass probability.' },
  { n: '04', t: 'Track progress', d: 'Every run is saved — visualize trends on your personal dashboard.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 mesh-grid opacity-40" />
        <div className="absolute -top-40 left-1/4 w-[720px] h-[720px] rounded-full bg-indigo-600/25 blur-[120px] animate-float-slow" />
        <div style={{ animationDelay: '-10s' }} className="absolute top-1/3 right-0 w-[560px] h-[560px] rounded-full bg-fuchsia-600/15 blur-[110px] animate-float-slow" />
        <div style={{ animationDelay: '-6s' }} className="absolute bottom-0 left-0 w-[640px] h-[640px] rounded-full bg-cyan-500/10 blur-[100px] animate-float-slow" />
      </div>

      {/* Nav */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 nav-glass"
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <LogoMark className="w-11 h-11" iconClass="w-6 h-6" />
            <div>
              <p className="font-display font-bold text-lg text-white tracking-tight group-hover:text-indigo-200 transition-colors">StudentAI</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Performance intelligence</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#stack" className="hover:text-white transition-colors">Stack</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="btn-primary text-sm py-2.5 px-5 rounded-xl shadow-glow"
            >
              Get started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-5 max-w-6xl mx-auto">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p variants={heroItem} className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            AI-Based Student Performance Prediction System
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight"
          >
            Predict outcomes.{' '}
            <span className="gradient-text">Course-correct</span>
            {' '}early.
          </motion.h1>
          <motion.p variants={heroItem} className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
            A production-style stack for your evaluation: interactive sliders, ML inference, persistent history,
            and analytics — wrapped in a polished, responsive interface examiners can explore in minutes.
          </motion.p>
          <motion.div variants={heroItem} className="mt-10 flex flex-wrap gap-4">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base shadow-glow">
              Start free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold border border-slate-600/60 text-slate-200 hover:bg-white/5 hover:border-slate-500 transition-all"
            >
              See features
            </a>
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20 relative"
        >
          <div className="gradient-border-wrap shadow-card">
            <div className="gradient-border-inner p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Model</p>
                  <p className="font-display text-2xl font-bold text-white">Random Forest</p>
                  <p className="text-sm text-slate-500 mt-1">Ensemble · non-linear boundaries</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Inference</p>
                  <p className="font-display text-2xl font-bold text-white">FastAPI + Uvicorn</p>
                  <p className="text-sm text-slate-500 mt-1">REST · CORS-ready · JSON schema</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Experience</p>
                  <p className="font-display text-2xl font-bold text-white">Charts & history</p>
                  <p className="text-sm text-slate-500 mt-1">Recharts · motion · glass UI</p>
                </div>
              </div>
              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              <p className="mt-6 text-sm text-slate-500 text-center md:text-left">
                Designed to demonstrate clear separation: <span className="text-slate-400">React client</span>
                {' → '}
                <span className="text-slate-400">Express + MongoDB</span>
                {' → '}
                <span className="text-slate-400">Python ML service</span>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5 max-w-6xl mx-auto scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Built for clarity & demos</h2>
          <p className="mt-3 text-slate-400">Everything your panel can click through — auth, prediction, persistence, visualization.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="glass-strong rounded-2xl p-8 hover:border-indigo-500/25 transition-colors group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.wrap} flex items-center justify-center mb-6 ring-1`}>
                <span className={f.fg}>{f.icon}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20 px-5 max-w-6xl mx-auto scroll-mt-28 border-y border-white/5 bg-white/[0.02]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">End-to-end pipeline</h2>
          <p className="mt-3 text-slate-400">From login to stored prediction — ideal for architecture diagrams in your report.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative glass rounded-2xl p-6 pt-8 border border-white/5"
            >
              <span className="absolute top-4 right-4 font-display text-3xl font-bold text-white/10">{s.n}</span>
              <h3 className="font-display font-semibold text-white mb-2">{s.t}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="py-20 px-5 max-w-6xl mx-auto scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Technology stack</h2>
          <p className="mt-3 text-slate-400">Modern tooling across the full stack.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {stack.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-center min-w-[120px]"
            >
              <p className="font-display font-semibold text-white">{t.name}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{t.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-fuchsia-950/40 p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <h2 className="relative font-display text-3xl md:text-4xl font-bold text-white">Ready for your evaluation demo?</h2>
          <p className="relative mt-4 text-slate-400 max-w-lg mx-auto">
            Spin up the ML service, backend, and this UI — then walk through signup → predict → dashboard.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="btn-primary px-10 py-3.5 rounded-2xl text-base">Create account</Link>
            <Link to="/login" className="px-10 py-3.5 rounded-2xl text-base font-semibold border border-white/15 text-white hover:bg-white/5 transition-all">
              I already have access
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-10 px-5 text-center text-sm text-slate-600">
        StudentAI · Academic performance prediction · Built with React & FastAPI
      </footer>
    </div>
  );
}
