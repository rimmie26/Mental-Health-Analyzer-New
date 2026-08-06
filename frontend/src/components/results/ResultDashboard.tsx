import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ActionPlanItem {
  rootCause: string;
  actionItems: string[];
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

export const ResultsDashboard = ({ data, onReset }: ResultsDashboardProps) => {
  const { riskLevel, riskScore, stressFactors, recommendations, riskDistribution } = data;
  // Only present when the survey was actually submitted to the backend (see useScreener.ts) -
  // the client-only fallback estimate has no rootCause -> actionItems mapping to show.
  const actionPlan: ActionPlanItem[] | undefined = data.actionPlan;

  const colors: Record<string, string> = { 
    Low: 'text-green-500', 
    Moderate: 'text-yellow-500', 
    High: 'text-red-500' 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-charcoal">
          <i className="fas fa-brain text-dark-yellow mr-3"></i> Analysis
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white rounded-full text-charcoal/60 hover:text-charcoal border border-pastel-blue/20"
        >
          <i className="fas fa-arrow-left mr-2"></i> Retake
        </button>
      </div>

      <div className="bg-gradient-to-r from-pastel-yellow/30 to-pastel-blue/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Risk Level</h3>
            <p className={`text-3xl font-bold ${colors[riskLevel] || 'text-charcoal'}`}>
              {riskLevel} {riskLevel === 'Low' ? '😊' : riskLevel === 'Moderate' ? '🤔' : '😟'}
            </p>
            <p className="text-sm text-charcoal/60">Score: {riskScore}/100</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center border-4 border-dark-yellow">
            <span className="text-2xl font-bold">{riskScore}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {riskDistribution.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Stress Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={stressFactors} outerRadius="75%">
                <PolarGrid stroke="#d4a37333" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#3d3d3d' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="#d4a373"
                  fill="#d4a373"
                  fillOpacity={0.45}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {actionPlan && actionPlan.length > 0 ? (
        <div className="mt-8 bg-white/80 rounded-2xl p-6 shadow-md">
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
        <div className="mt-8 bg-gradient-to-r from-pastel-yellow/20 to-pastel-blue/20 rounded-2xl p-6">
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
      )}
    </motion.div>
  );
};