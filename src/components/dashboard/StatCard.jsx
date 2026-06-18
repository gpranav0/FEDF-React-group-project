import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

function useCountUp(targetStr, duration = 1200) {
  const [displayValue, setDisplayValue] = useState('0');
  const frameRef = useRef(null);

  useEffect(() => {
    const numericStr = targetStr.replace(/[^0-9.\-]/g, '');
    const target = parseFloat(numericStr) || 0;
    const prefix = targetStr.match(/^[^0-9\-]*/)?.[0] || '';
    const hasDecimals = targetStr.includes('.');

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (hasDecimals) {
        setDisplayValue(`${prefix}${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      } else {
        setDisplayValue(`${prefix}${Math.round(current).toLocaleString()}`);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetStr);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetStr, duration]);

  return displayValue;
}

export default function StatCard({
  title,
  amount,
  icon: Icon,
  trend,
  trendValue,
  iconBg,
  iconColor,
  insight,
  sparklineData,
  sparklineColor = "#3b82f6"
}) {
  const isPositive = trend === 'up';
  const animatedAmount = useCountUp(amount);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden glass-panel p-6 rounded-2xl group"
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150 ${iconBg.replace('bg-', 'bg-gradient-to-br from-white to-')}`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${iconBg.replace('bg-', 'bg-').replace('50', '50 dark:bg-opacity-30 dark:bg-')} ${iconColor.replace('text-', 'text-').replace('600', '600 dark:text-')} bg-opacity-50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{animatedAmount}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {trendValue}
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{insight}</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="w-20 h-12 ml-4 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={sparklineColor}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
