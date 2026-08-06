import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Stress", value: 75 },
  { subject: "Anxiety", value: 60 },
  { subject: "Sleep", value: 85 },
  { subject: "Focus", value: 70 },
  { subject: "Mood", value: 90 },
  { subject: "Energy", value: 80 },
];

// Calculate overall wellness score
const overallScore = Math.round(
  data.reduce((sum, item) => sum + item.value, 0) / data.length
);

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

const status = getStatus(overallScore);

const StressRadar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            🧠 Stress Radar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered mental wellness analysis
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
            Mood
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Lowest</p>
          <p className="font-semibold text-orange-600">
            Anxiety
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Trend</p>
          <p className="font-semibold text-blue-600">
            Improving
          </p>
        </div>

      </div>
    </div>
  );
};

export default StressRadar;