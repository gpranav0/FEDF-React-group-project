import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { calculateHealthScore, FACTOR_META, getScoreLevel } from '../../utils/healthScoreUtils';

// ─── Animated counter hook ───────────────────────────────────────────
function useAnimatedCounter(target, duration = 1.4) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, duration, motionValue, rounded]);

  return display;
}

// ─── Score breakdown mini-bar ────────────────────────────────────────
function BreakdownBar({ label, icon, weight, value, delay = 0 }) {
  const level = getScoreLevel(value);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm" aria-hidden="true">{icon}</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {weight}
          </span>
          <span className={`text-xs font-bold tabular-nums ${level.text} ${level.darkText}`}>
            {value}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${level.gradient[0]}, ${level.gradient[1]})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
export default function FinancialHealthScore() {
  const [ready, setReady] = useState(false);
  const ringRef = useRef(null);

  // Pull data from localStorage & compute score
  const result = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch { /* noop */ }
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch { /* noop */ }
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch { /* noop */ }
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch { /* noop */ }

    const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;

    return calculateHealthScore(expenses, budgets, goals, monthlyIncome);
  }, []);

  const { score, level, breakdown, strengths, improvements } = result;

  // Trigger animations after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Animated counter
  const displayScore = useAnimatedCounter(ready ? score : 0, 1.6);

  // SVG ring geometry
  const SIZE = 160;
  const STROKE = 10;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  // Gradient ID for SVG
  const gradientId = `health-ring-gradient-${level.label}`;

  return (
    <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden" id="financial-health-score">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${level.gradient[0]}20, ${level.gradient[1]}20)`,
            }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: level.gradient[0] }}
            />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Financial Health
          </h3>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${level.bg} ${level.text} ${level.darkBg} ${level.darkText}`}
        >
          <span>{level.emoji}</span>
          {level.label}
        </motion.span>
      </div>

      {/* ── Score ring ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center py-5 px-6">
        <div className="relative flex items-center justify-center" ref={ringRef}>
          {/* Glow effect */}
          {ready && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                width: SIZE + 24,
                height: SIZE + 24,
                background: `radial-gradient(circle, ${level.glow} 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
            />
          )}

          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={level.gradient[0]} />
                <stop offset="100%" stopColor={level.gradient[1]} />
              </linearGradient>
            </defs>

            {/* Background ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-slate-100 dark:text-slate-800"
            />

            {/* Progress ring — animated */}
            {ready && (
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-extrabold tabular-nums text-slate-900 dark:text-white leading-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              {displayScore}
            </motion.span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              / 100
            </span>
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {level.tagline}
        </motion.p>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="mx-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* ── Score Breakdown ─────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Score Breakdown
        </h4>
        <div className="space-y-3">
          {FACTOR_META.map((factor, i) => (
            <BreakdownBar
              key={factor.key}
              label={factor.label}
              icon={factor.icon}
              weight={factor.weight}
              value={breakdown[factor.key]}
              delay={0.8 + i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="mx-6 mt-3">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* ── Recommendations ─────────────────────────────────────────── */}
      <div className="px-6 pt-4 pb-6 space-y-4 flex-1">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + idx * 0.08 }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
                      {item.text}
                    </p>
                    {item.detail && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Improvements
            </h4>
            <ul className="space-y-2">
              {improvements.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 + idx * 0.08 }}
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
                      {item.text}
                    </p>
                    {item.detail && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
