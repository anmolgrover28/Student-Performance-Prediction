import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import Navbar from '../components/Navbar';
import PageBackdrop from '../components/PageBackdrop';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getHistory } from '../utils/api';
import { downloadPredictionsCsv } from '../utils/exportCsv';

const COLORS = ['#34d399', '#f87171'];

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-slate-700/60 rounded w-24 mb-4" />
      <div className="h-10 bg-slate-700/40 rounded w-16" />
    </div>
  );
}

const StatCard = ({ label, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="glass-strong rounded-2xl p-6 hover:border-indigo-500/20 transition-colors group"
  >
    <div className="flex items-start justify-between mb-3">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform ring-1 ring-white/5">
        {icon}
      </div>
    </div>
    <p className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async (opts = {}) => {
    const { notify } = opts;
    if (notify) setRefreshing(true);
    try {
      const res = await getHistory();
      setHistory(res.data.predictions);
      if (notify) showToast('History updated.');
    } catch (e) {
      console.error(e);
      showToast('Could not load history.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleExport = () => {
    if (!history.length) return;
    downloadPredictionsCsv(history);
    showToast('CSV downloaded.');
  };

  const handleRefresh = () => loadHistory({ notify: true });

  const totalPredictions = history.length;
  const passCount = history.filter((p) => p.result === 'PASS').length;
  const failCount = totalPredictions - passCount;
  const avgProbability = totalPredictions
    ? (history.reduce((sum, p) => sum + p.probability, 0) / totalPredictions).toFixed(1)
    : 0;

  const pieData = [
    { name: 'PASS', value: passCount },
    { name: 'FAIL', value: failCount },
  ];

  const chartRows = history.slice(0, 12).reverse().map((p, i) => ({
    name: `#${i + 1}`,
    probability: p.probability,
    result: p.result,
  }));

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <PageBackdrop />
        <Navbar />
        <div className="max-w-7xl mx-auto px-5 pt-28 pb-16 relative z-10">
          <div className="h-10 w-64 bg-slate-800/60 rounded-xl animate-pulse mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
          </div>
          <div className="h-72 glass rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <PageBackdrop />
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 pt-28 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/90 mb-2 font-medium">Overview</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Hey <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            <span className="text-slate-600 mx-2">—</span>
            <span className="text-slate-400 font-normal text-2xl md:text-3xl">here&apos;s your intelligence snapshot.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10 md:mb-12">
          <StatCard
            label="Predictions"
            value={totalPredictions}
            delay={0.05}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <StatCard
            label="Pass"
            value={passCount}
            delay={0.1}
            icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          />
          <StatCard
            label="Fail"
            value={failCount}
            delay={0.15}
            icon={<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          />
          <StatCard
            label="Avg probability"
            value={`${avgProbability}%`}
            delay={0.2}
            icon={<svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>

        {totalPredictions > 0 && (
          <div className="grid lg:grid-cols-5 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-3 glass-strong rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-white text-lg">Probability trajectory</h3>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Recent runs</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartRows}>
                  <defs>
                    <linearGradient id="probFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    formatter={(val) => [`${val}%`, 'Pass prob.']}
                  />
                  <Area
                    type="monotone"
                    dataKey="probability"
                    stroke="#a5b4fc"
                    strokeWidth={2}
                    fill="url(#probFill)"
                    dot={{ fill: '#c4b5fd', strokeWidth: 0, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass-strong rounded-2xl p-6 md:p-8 flex flex-col"
            >
              <h3 className="font-display font-semibold text-white text-lg mb-2">Outcome mix</h3>
              <p className="text-xs text-slate-500 mb-4">Distribution across all saved predictions</p>
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={86}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(v) => <span className="text-slate-400 text-sm">{v}</span>}
                      verticalAlign="bottom"
                      height={36}
                    />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="lg:col-span-5 glass rounded-2xl p-6"
            >
              <h3 className="font-display font-semibold text-white text-lg mb-6">Comparison by run</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartRows} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    formatter={(val) => [`${val}%`, 'Probability']}
                  />
                  <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                    {chartRows.map((entry, index) => (
                      <Cell key={index} fill={entry.result === 'PASS' ? '#6366f1' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {totalPredictions === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-3xl p-14 md:p-16 text-center max-w-2xl mx-auto border border-indigo-500/10"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20 flex items-center justify-center ring-1 ring-white/10">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Your canvas is empty</h3>
            <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
              Run a prediction to populate charts, history, and rolling averages — perfect to show live in a viva.
            </p>
            <Link to="/predict" className="btn-primary inline-flex items-center gap-2 px-10 py-3.5 rounded-2xl">
              Launch predictor
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-strong rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="px-6 py-4 border-b border-slate-700/40 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display font-semibold text-white">Prediction log</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 disabled:opacity-50"
                  title="Reload from server"
                >
                  <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5"
                  title="Download table as CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
                <Link to="/predict" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10">
                  New run
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-700/40 bg-slate-900/30">
                    {['Date', 'Attendance', 'Marks', 'Study hrs', 'Prev.', 'Result', 'Prob.'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {history.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.45) }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-slate-400 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{p.attendance}%</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{p.marks}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{p.studyHours}h</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{p.previousPerformance}%</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                            p.result === 'PASS'
                              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25'
                              : 'bg-red-500/15 text-red-300 ring-1 ring-red-500/25'
                          }`}
                        >
                          {p.result}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-800 rounded-full h-2 max-w-[100px] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${p.result === 'PASS' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
                              style={{ width: `${Math.min(p.probability, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-300 tabular-nums w-12">{p.probability}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
