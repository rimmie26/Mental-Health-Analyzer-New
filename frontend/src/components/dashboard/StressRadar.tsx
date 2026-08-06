import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { getLatestAnalysis } from "../../utils/api";

const getStatus = (score: number) => {
  if (score >= 85)
    return {
      label: "Excellent",
      color: "bg-green-100 text-green-700",
    };

  if (score >= 70)
    return {
      label: "Healthy",
      color: "bg-amber-100 text-amber-700",
    };

  if (score >= 50)
    return {
      label: "Moderate",
      color: "bg-orange-100 text-orange-700",
    };

  return {
    label: "Needs Attention",
    color: "bg-red-100 text-red-700",
  };
};

// Shortened labels for the radar's angle axis - the real category names
// ("Financial Well-being") are wordy for a 6-point chart at this size.
const SHORT_LABEL: Record<string, string> = {
  "Academic Health": "Academic",
  "Sleep Health": "Sleep",
  "Lifestyle Health": "Lifestyle",
  "Mental Well-being": "Mental",
  "Financial Well-being": "Financial",
};

const StressRadar = () => {
  const analysis = getLatestAnalysis();

  // No screening completed yet - show that honestly instead of a chart
  // full of numbers nobody actually reported.
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              🧠 Stress Radar
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              AI-powered mental wellness analysis
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            Complete your first screening to see your wellness radar here.
          </p>
        </div>
      </div>
    );
  }

  const data = Object.entries(analysis.health_indicators).map(
    ([category, indicator]) => ({
      subject: SHORT_LABEL[category] ?? category,
      fullLabel: category,
      value: Math.round(indicator.score),
    })
  );

  const overallScore = Math.round(analysis.overall_wellbeing_score);
  const status = getStatus(overallScore);

  const highest = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
  const lowest = data.reduce((a, b) => (b.value < a.value ? b : a), data[0]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            🧠 Stress Radar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your last screening
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mb-5 border border-amber-100">
        <p className="text-sm text-gray-500">
          Overall Wellness Score
        </p>

        <div className="flex items-end gap-2 mt-1">
          <span className="text-5xl font-bold text-amber-600">
            {overallScore}
          </span>

          <span className="text-xl text-gray-400 mb-1">
            /100
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 30,
            }}
          >
            <PolarGrid stroke="#E5E7EB" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fontSize: 13,
                fill: "#4B5563",
              }}
            />

            <PolarRadiusAxis
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            <Radar
              dataKey="value"
              stroke="#F59E0B"
              fill="#FBBF24"
              fillOpacity={0.45}
              strokeWidth={3}
              isAnimationActive
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">

        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Highest</p>
          <p className="font-semibold text-green-600">
            {highest.fullLabel}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Lowest</p>
          <p className="font-semibold text-orange-600">
            {lowest.fullLabel}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Assessment</p>
          <p className="font-semibold text-blue-600">
            {analysis.prediction}
          </p>
        </div>

      </div>
    </div>
  );
};

export default StressRadar;
