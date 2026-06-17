import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, PiggyBank, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { calculateHealthScore } from '../../utils/healthScoreUtils';

export default function DashboardHero({ balance, savings, currencySymbol = '₹' }) {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const hour = currentDate.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const { status, profileName } = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch {}
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch {}
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch {}
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch {}

    const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
    const name = settings?.profile?.fullName?.split(' ')[0] || 'Pranav';
    
    const health = calculateHealthScore(expenses, budgets, goals, monthlyIncome);
    return { status: health.status, profileName: name };
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Excellent': return 'bg-emerald-400/20 text-emerald-100 border-emerald-400/30';
      case 'Good': return 'bg-blue-400/20 text-blue-100 border-blue-400/30';
      case 'Fair': return 'bg-amber-400/20 text-amber-100 border-amber-400/30';
      case 'Poor': return 'bg-red-400/20 text-red-100 border-red-400/30';
      default: return 'bg-white/20 text-white border-white/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-primary to-indigo-800 shadow-xl border border-blue-700/50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-8 md:p-10 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          {/* Left section: Greeting & Message */}
          <div className="flex-1 space-y-4">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-blue-50 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {dateString}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
                {greeting}, {profileName} <span className="origin-bottom-right inline-block hover:animate-pulse">👋</span>
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-xl leading-relaxed opacity-90">
                Welcome back to FinTrack. Your finances are looking <span className="font-semibold text-white">healthy</span> today.
              </p>
            </motion.div>
          </div>

          {/* Right section: Stats */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <motion.div 
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[180px] shadow-sm hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-blue-100 mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">Current Balance</span>
                </div>
                <div className="flex items-center text-emerald-300 text-xs font-semibold bg-emerald-400/20 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +8.1%
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{currencySymbol}{balance}</span>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[180px] shadow-sm hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-blue-100 mb-2">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" />
                  <span className="text-sm font-medium">Monthly Savings</span>
                </div>
                <div className="flex items-center text-emerald-300 text-xs font-semibold bg-emerald-400/20 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{currencySymbol}{savings}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Health Status */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3"
        >
          <span className="text-blue-100 text-sm font-medium">Health Status:</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-sm text-sm font-semibold shadow-sm ${getStatusColor(status)}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {status}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
