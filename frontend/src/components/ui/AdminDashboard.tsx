import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminBreakdown, fetchAdminCorrelation, fetchAdminCSVBlob } from '../../utils/api';

interface AdminDashboardProps {
  onBack: () => void;
}

type GroupBy = 'department' | 'year' | 'gender';

interface BreakdownGroup {
  group: string;
  studentCount: number;
  studentsWithSurvey: number;
  avgRiskScore: number | null;
  riskDistribution: { LOW: number; MEDIUM: number; HIGH: number; NO_DATA: number };
}

interface CorrelationData {
  sampleSize: number;
  variables: string[];
  labels: string[];
  matrix: (number | null)[][];
}

const RISK_COLORS: Record<string, string> = {
  LOW: 'bg-emerald-400',
  MEDIUM: 'bg-amber-400',
  HIGH: 'bg-rose-500',
  NO_DATA: 'bg-gray-300',
};

// Maps a Pearson r value to a background color - orange for positive, blue for
// negative, intensity scaled by |r|. Keeps it in the same amber/orange palette
// as the rest of the app instead of a generic red/green heatmap.
const correlationCellColor = (r: number | null): string => {
  if (r === null) return '#f3f4f6';
  const intensity = Math.min(Math.abs(r), 1);
  return r >= 0
    ? `rgba(249, 115, 22, ${0.12 + intensity * 0.75})`
    : `rgba(59, 130, 246, ${0.12 + intensity * 0.75})`;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('department');
  const [groups, setGroups] = useState<BreakdownGroup[] | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(true);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);

  const [correlation, setCorrelation] = useState<CorrelationData | null>(null);
  const [correlationLoading, setCorrelationLoading] = useState(true);
  const [correlationError, setCorrelationError] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBreakdownLoading(true);
    fetchAdminBreakdown(groupBy)
      .then((res) => { if (!cancelled) setGroups(res.groups); })
      .catch((err) => {
        if (cancelled) return;
        setBreakdownError(err.response?.status === 403 ? 'Admin access required.' : 'Could not load breakdown.');
      })
      .finally(() => { if (!cancelled) setBreakdownLoading(false); });
    return () => { cancelled = true; };
  }, [groupBy]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminCorrelation()
      .then((res) => { if (!cancelled) setCorrelation(res); })
      .catch((err) => {
        if (cancelled) return;
        setCorrelationError(err.response?.status === 403 ? 'Admin access required.' : 'Could not load correlation data.');
      })
      .finally(() => { if (!cancelled) setCorrelationLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await fetchAdminCSVBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mindwell-admin-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError('Could not export CSV.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🛠️ Admin Analytics</h2>
          <p className="text-gray-500 text-sm">Department, year, and gender-wise wellness breakdowns</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h4 className="font-semibold text-gray-700">📊 Student Breakdown</h4>
          <div className="flex gap-2">
            {(['department', 'year', 'gender'] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  groupBy === g
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {breakdownLoading && <p className="text-sm text-gray-400">Loading breakdown...</p>}
        {breakdownError && <p className="text-sm text-rose-600">{breakdownError}</p>}

        {groups && groups.length === 0 && (
          <p className="text-sm text-gray-400">No students found for this grouping.</p>
        )}

        {groups && groups.length > 0 && (
          <div className="space-y-4">
            {groups.map((g) => {
              const total = g.studentCount || 1;
              return (
                <div key={g.group} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <p className="font-semibold text-gray-800">{g.group}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{g.studentCount} students</span>
                      <span>{g.studentsWithSurvey} surveyed</span>
                      <span className="font-semibold text-gray-700">
                        {g.avgRiskScore !== null ? `Avg risk: ${g.avgRiskScore}` : 'No risk data'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100">
                    {(['LOW', 'MEDIUM', 'HIGH', 'NO_DATA'] as const).map((level) => {
                      const count = g.riskDistribution[level];
                      if (!count) return null;
                      return (
                        <div
                          key={level}
                          className={RISK_COLORS[level]}
                          style={{ width: `${(count / total) * 100}%` }}
                          title={`${level}: ${count}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>Low {g.riskDistribution.LOW}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span>Medium {g.riskDistribution.MEDIUM}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1"></span>High {g.riskDistribution.HIGH}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1"></span>No data {g.riskDistribution.NO_DATA}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Correlation heatmap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-1">🔥 Correlation Heatmap</h4>
        <p className="text-xs text-gray-400 mb-4">
          Pearson correlation across every survey response{correlation ? ` (n = ${correlation.sampleSize})` : ''}
        </p>

        {correlationLoading && <p className="text-sm text-gray-400">Loading correlation data...</p>}
        {correlationError && <p className="text-sm text-rose-600">{correlationError}</p>}

        {correlation && correlation.sampleSize < 2 && (
          <p className="text-sm text-gray-400">Not enough survey responses yet to compute correlations.</p>
        )}

        {correlation && correlation.sampleSize >= 2 && (
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {correlation.labels.map((label) => (
                    <th key={label} className="p-2 text-xs font-medium text-gray-500 whitespace-nowrap">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlation.matrix.map((row, i) => (
                  <tr key={correlation.labels[i]}>
                    <td className="p-2 text-xs font-medium text-gray-500 whitespace-nowrap text-right">{correlation.labels[i]}</td>
                    {row.map((value, j) => (
                      <td
                        key={j}
                        className="p-2 text-center text-xs font-semibold text-gray-700 rounded-lg"
                        style={{ backgroundColor: correlationCellColor(value), minWidth: '72px' }}
                      >
                        {value === null ? '—' : value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV export */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="font-semibold text-gray-700">⬇️ Export</h4>
          <p className="text-xs text-gray-400">Download a per-student CSV: demographics, latest survey, and engagement</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-medium shadow-sm hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Download CSV'}
        </button>
      </div>
      {exportError && <p className="text-sm text-rose-600 -mt-2">{exportError}</p>}
    </motion.div>
  );
};

export default AdminDashboard;