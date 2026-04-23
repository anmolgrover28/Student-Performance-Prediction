import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import PageBackdrop from '../components/PageBackdrop';
import { makePrediction } from '../utils/api';
import { useToast } from '../context/ToastContext';

function buildPredictionSummary(pred) {
  let text = `StudentAI — Prediction\nOutcome: ${pred.result}\nPass probability: ${pred.probability}%\n\nInputs:\n• Attendance: ${pred.attendance}%\n• Internal marks: ${pred.marks}\n• Study hours/day: ${pred.studyHours}\n• Previous performance: ${pred.previousPerformance}%\n`;
  if (pred.suggestions?.length) {
    text += '\nRecommendations:\n';
    pred.suggestions.forEach((s, i) => {
      text += `${i + 1}. ${s}\n`;
    });
  }
  return text.trim();
}

const PRESETS = {
  strong: { attendance: 92, marks: 78, studyHours: 6, previousPerformance: 85 },
  average: { attendance: 72, marks: 55, studyHours: 4, previousPerformance: 58 },
  atRisk: { attendance: 58, marks: 38, studyHours: 2, previousPerformance: 42 },
};

const SliderField = ({ label, name, value, min, max, unit, onChange, icon }) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-500">{min}{unit} — {max}{unit}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-slate-400 text-sm ml-1">{unit}</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percent}%, #334155 ${percent}%, #334155 100%)`,
          }}
        />
      </div>
    </div>
  );
};

const ResultBadge = ({ result }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto border-4 ${
      result === 'PASS'
        ? 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
        : 'bg-red-500/10 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
    }`}
  >
    <span className="text-4xl">{result === 'PASS' ? '✓' : '✗'}</span>
    <span className={`text-sm font-bold mt-1 ${result === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
      {result}
    </span>
  </motion.div>
);

export default function Predict() {
  const { showToast } = useToast();
  const formRef = useRef(null);
  const [form, setForm] = useState({
    attendance: 75,
    marks: 60,
    studyHours: 4,
    previousPerformance: 65,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (loading) return;
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const applyPreset = (key) => {
    setForm(PRESETS[key]);
    setError('');
    showToast(`Loaded “${key === 'strong' ? 'Strong' : key === 'atRisk' ? 'At risk' : 'Average'}” preset.`);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = buildPredictionSummary(result);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Summary copied to clipboard.');
    } catch {
      showToast('Clipboard not available.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await makePrediction(form);
      setResult(res.data.prediction);
      showToast('Prediction saved to your history.');
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Ensure ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Attendance', name: 'attendance', min: 0, max: 100, unit: '%', icon: '📅' },
    { label: 'Internal Marks', name: 'marks', min: 0, max: 100, unit: 'pts', icon: '📝' },
    { label: 'Daily Study Hours', name: 'studyHours', min: 0, max: 12, unit: 'hrs', icon: '📚' },
    { label: 'Previous Performance', name: 'previousPerformance', min: 0, max: 100, unit: '%', icon: '📊' },
  ];

  return (
    <div className="relative min-h-screen">
      <PageBackdrop variant="warm" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 pt-28 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300/90 mb-2 font-medium">Inference</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
            Performance <span className="gradient-text">prediction lab</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl leading-relaxed">
            Tune inputs — attendance, internals, study hours, and prior performance — then call the Random Forest model through your backend and FastAPI ML service.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 mr-2 self-center">Quick presets:</span>
            <button type="button" onClick={() => applyPreset('strong')} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25 hover:bg-emerald-500/25 transition-colors">
              Strong student
            </button>
            <button type="button" onClick={() => applyPreset('average')} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 ring-1 ring-slate-600 hover:bg-slate-600/80 transition-colors">
              Average
            </button>
            <button type="button" onClick={() => applyPreset('atRisk')} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25 hover:bg-amber-500/25 transition-colors">
              At risk
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <form id="predict-form" ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <SliderField {...f} value={form[f.name]} onChange={handleChange} />
                </motion.div>
              ))}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all duration-200"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #4338ca, #7c3aed)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Predict performance
                  </>
                )}
              </motion.button>
              <p className="text-center text-[11px] text-slate-600">
                Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">⌘</kbd>
                {' + '}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Enter</kbd>
                {' · '}
                Windows: Ctrl+Enter
              </p>
            </form>
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <h3 className="font-display font-bold text-xl text-white">Prediction result</h3>
                    <button
                      type="button"
                      onClick={copyResult}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 text-indigo-300 hover:text-white ring-1 ring-slate-600 hover:ring-indigo-500/50 transition-all"
                    >
                      Copy summary
                    </button>
                  </div>

                  <ResultBadge result={result.result} />

                  <div className="mt-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Pass probability</span>
                      <span className="font-bold text-white">{result.probability}%</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className={`h-full rounded-full ${
                          result.result === 'PASS'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-red-500 to-orange-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Attendance', value: `${result.attendance}%` },
                      { label: 'Marks', value: `${result.marks}` },
                      { label: 'Study hours', value: `${result.studyHours}h` },
                      { label: 'Prev. perf.', value: `${result.previousPerformance}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-800/50 rounded-xl px-3 py-2">
                        <p className="text-slate-500 text-xs">{label}</p>
                        <p className="text-white font-semibold text-sm">{value}</p>
                      </div>
                    ))}
                  </div>

                  {result.suggestions?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <span>💡</span> AI recommendations
                      </h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((s, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                            {s}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-400 font-medium mb-2">Awaiting prediction</h3>
                  <p className="text-slate-600 text-sm">
                    Use presets or sliders, then submit — results appear here with copy-ready summary text.
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                    {[
                      { icon: '🌲', label: 'Random Forest', desc: 'Ensemble' },
                      { icon: '🎯', label: 'Validated', desc: 'Train/test split' },
                      { icon: '⚡', label: 'Real-time', desc: 'REST inference' },
                    ].map(({ icon, label, desc }) => (
                      <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                        <div className="text-2xl mb-1">{icon}</div>
                        <p className="text-white text-xs font-medium">{label}</p>
                        <p className="text-slate-500 text-xs">{desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
