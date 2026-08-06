import { motion } from 'framer-motion';

interface ActionPlanItem {
  rootCause: string;
  actionItems: string[];
}

interface WellbeingCategory {
  key: string;
  label: string;
  icon: string;
  score: number;
}

interface ResultsDashboardProps {
  data: any;
  onReset: () => void;
}

// Root causes come from the backend as short labels (see recommendationController.js's
// ACTION_MAP keys). Map each to an icon/color so "why you're at risk" reads as a proper
// diagnosis section rather than a plain list.
const ROOT_CAUSE_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  'Poor Sleep': { icon: 'fa-moon', color: 'text-blue-600', bg: 'bg-blue-50' },
  'Academic Pressure': { icon: 'fa-book', color: 'text-amber-600', bg: 'bg-amber-50' },
  'Financial Stress': { icon: 'fa-coins', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Loneliness': { icon: 'fa-user-group', color: 'text-purple-600', bg: 'bg-purple-50' },
  'General Academic Stress': { icon: 'fa-triangle-exclamation', color: 'text-orange-600', bg: 'bg-orange-50' },
};
const DEFAULT_ROOT_CAUSE_STYLE = { icon: 'fa-circle-exclamation', color: 'text-gray-600', bg: 'bg-gray-50' };

// Slider color by score band (higher = healthier)
const scoreColor = (score: number) => {
  if (score >= 70) return { bar: 'from-emerald-400 to-emerald-500', text: 'text-emerald-600' };
  if (score >= 45) return { bar: 'from-amber-400 to-amber-500', text: 'text-amber-600' };
  return { bar: 'from-red-400 to-red-500', text: 'text-red-600' };
};

export const ResultsDashboard = ({ data, onReset }: ResultsDashboardProps) => {
  const { recommendations } = data;
  // Only present when the survey was actually submitted to the backend (see useScreener.ts) -
  // the client-only fallback estimate has no rootCause -> actionItems mapping to show.
  const actionPlan: ActionPlanItem[] | undefined = data.actionPlan;

  // Wellbeing data: prefer a precomputed shape from the backend/calculateWellbeing,
  // fall back gracefully if only the old risk-shaped data is present.
  const overall: number = data.overall ?? Math.max(0, 100 - (data.riskScore ?? 30));
  const categories: WellbeingCategory[] = data.categories ?? [];

  const overallColor = scoreColor(overall);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-charcoal">
          <i className="fas fa-brain text-dark-yellow mr-3"></i> Your Well-being Report
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white rounded-full text-charcoal/60 hover:text-charcoal border border-pastel-blue/20"
        >
          <i className="fas fa-arrow-left mr-2"></i> Retake
        </button>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-pastel-yellow/30 to-pastel-blue/30 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-charcoal/60 uppercase tracking-wide">
              Overall Well-being Score
            </h3>
            <p className={`text-4xl font-bold mt-1 ${overallColor.text}`}>
              {overall}<span className="text-xl text-charcoal/40">/100</span>
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center border-4 border-dark-yellow text-2xl">
            {overall >= 70 ? '😊' : overall >= 45 ? '🤔' : '😟'}
          </div>
        </div>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${overallColor.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${overall}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Health Indicator Sliders */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-5 text-charcoal">Health Indicators</h3>
        <div className="space-y-5">
          {categories.map((cat, i) => {
            const c = scoreColor(cat.score);
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-charcoal/80 flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    {cat.label}
                  </span>
                  <span className={`text-sm font-bold ${c.text}`}>{cat.score}/100</span>
                </div>
                <div className="h-2.5 bg-pastel-blue/15 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08 + 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Crisis note - shown whenever mental well-being is low, regardless of other scores */}
      {categories.find((c) => c.key === 'mental' && c.score < 40) && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
          <i className="fas fa-heart-circle-exclamation mt-0.5"></i>
          <span>
            Your responses suggest you may be going through something difficult. If you're in distress,
            please reach out to a counselor, trusted person, or a mental health helpline near you.
          </span>
        </div>
      )}

      {actionPlan && actionPlan.length > 0 ? (
        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-1">
            <i className="fas fa-magnifying-glass text-dark-yellow mr-2"></i> Why you're at risk
          </h3>
          <p className="text-sm text-charcoal/60 mb-4">
            Your recommendations below are matched to the specific factors driving your score.
          </p>
          <div className="space-y-4">
            {actionPlan.map((item, i) => {
              const style = ROOT_CAUSE_STYLE[item.rootCause] || DEFAULT_ROOT_CAUSE_STYLE;
              return (
                <div key={i} className={`rounded-xl p-4 ${style.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`fas ${style.icon} ${style.color}`}></i>
                    <span className={`font-semibold ${style.color}`}>{item.rootCause}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {item.actionItems.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-charcoal/80">
                        <i className="fas fa-check-circle text-dark-yellow mt-0.5"></i>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        recommendations && recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-pastel-yellow/20 to-pastel-blue/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              <i className="fas fa-lightbulb text-dark-yellow mr-2"></i> Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-dark-yellow mt-1"></i>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </motion.div>
  );
};