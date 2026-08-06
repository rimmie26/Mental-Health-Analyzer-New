import React, { useState } from "react";

const WhatIfSimulator = () => {
  const [sleep, setSleep] = useState(7);
  const [study, setStudy] = useState(5);
  const [exercise, setExercise] = useState(3);
  const [meditation, setMeditation] = useState(10);

  // Baseline values (current lifestyle)
  const baseSleep = 7;
  const baseStudy = 5;
  const baseExercise = 3;
  const baseMeditation = 10;

  // ---------- AI Prediction Logic ----------

  const stress = Math.max(
    0,
    Math.min(
      100,
      80 -
        sleep * 5 -
        exercise * 3 -
        meditation * 0.4 +
        Math.max(0, study - 6) * 5
    )
  );

  const mood = Math.max(
    0,
    Math.min(
      100,
      40 +
        sleep * 5 +
        exercise * 4 +
        meditation * 0.6
    )
  );

  const productivity = Math.max(
    0,
    Math.min(
      100,
      20 +
        study * 8 +
        sleep * 3 +
        exercise * 2
    )
  );

  const wellness = Math.round(
    (mood + productivity + (100 - stress)) / 3
  );

  const baseStress = Math.max(
  0,
  Math.min(
    100,
    80 -
      baseSleep * 5 -
      baseExercise * 3 -
      baseMeditation * 0.4 +
      Math.max(0, baseStudy - 6) * 5
  )
);

const baseMood = Math.max(
  0,
  Math.min(
    100,
    40 +
      baseSleep * 5 +
      baseExercise * 4 +
      baseMeditation * 0.6
  )
);

const baseProductivity = Math.max(
  0,
  Math.min(
    100,
    20 +
      baseStudy * 8 +
      baseSleep * 3 +
      baseExercise * 2
  )
);

const baseWellness = Math.round(
  (baseMood + baseProductivity + (100 - baseStress)) / 3
);

  // ---------- Helper Functions ----------

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Moderate";
    return "Needs Attention";
  };

  const getStressColor = (score: number) => {
    if (score <= 30) return "text-green-600";
    if (score <= 60) return "text-orange-500";
    return "text-red-600";
  };

  const getMoodColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-orange-500";
    return "text-red-600";
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return "text-blue-700";
    if (score >= 60) return "text-orange-500";
    return "text-red-600";
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return "text-purple-700";
    if (score >= 60) return "text-orange-500";
    return "text-red-600";
  };

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const resetSimulation = () => {
    setSleep(7);
    setStudy(5);
    setExercise(3);
    setMeditation(10);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔮 What-if Simulator
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}

        <div className="space-y-8">

          <div>
            <div className="flex justify-between mb-2 font-semibold">
              <span>😴 Sleep Hours / Day</span>
              <span>{sleep} hrs</span>
            </div>

            <input
              type="range"
              min={4}
              max={10}
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2 font-semibold">
              <span>📚 Study Hours / Day</span>
              <span>{study} hrs</span>
            </div>

            <input
              type="range"
              min={0}
              max={12}
              value={study}
              onChange={(e) => setStudy(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2 font-semibold">
              <span>🏃 Exercise Days / Week</span>
              <span>{exercise} days</span>
            </div>

            <input
              type="range"
              min={0}
              max={7}
              value={exercise}
              onChange={(e) => setExercise(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2 font-semibold">
              <span>🧘 Meditation Minutes</span>
              <span>{meditation} min</span>
            </div>

            <input
              type="range"
              min={0}
              max={60}
              value={meditation}
              onChange={(e) => setMeditation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={resetSimulation}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Reset Simulation
          </button>
          <div className="mt-8 bg-gray-50 rounded-xl border p-5">

          <h3 className="text-xl font-bold mb-5">
                📊 Before vs After
          </h3>

                <div className="grid grid-cols-3 text-center font-semibold text-gray-600 border-b pb-2">

                    <div></div>

                    <div>Before</div>

                    <div>After</div>

                </div>

                <div className="space-y-4 mt-5">

                    <div className="grid grid-cols-3 text-center">

                    <span className="font-medium text-left">
                        Wellness
                    </span>

                    <span>{baseWellness}</span>

                    <span className="font-bold text-blue-600">
                        {wellness}
                    </span>

                    </div>

                    <div className="grid grid-cols-3 text-center">

                    <span className="font-medium text-left">
                        Stress
                    </span>

                    <span>{Math.round(baseStress)}</span>

                    <span className="font-bold text-red-500">
                        {Math.round(stress)}
                    </span>

                    </div>

                    <div className="grid grid-cols-3 text-center">

                    <span className="font-medium text-left">
                        Mood
                    </span>

                    <span>{Math.round(baseMood)}</span>

                    <span className="font-bold text-green-600">
                        {Math.round(mood)}
                    </span>

                    </div>

                    <div className="grid grid-cols-3 text-center">

                    <span className="font-medium text-left">
                        Productivity
                    </span>

                    <span>{Math.round(baseProductivity)}</span>

                    <span className="font-bold text-purple-600">
                        {Math.round(productivity)}
                    </span>

                    </div>

                </div>

                </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="bg-orange-50 rounded-2xl p-6 flex flex-col">

          <h3 className="text-2xl font-bold text-center mb-6">
            🤖 AI Wellness Prediction
          </h3>

          <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Overall Wellness
            </p>

            <p className={`text-3xl font-bold ${getWellnessColor(wellness)}`}>
              {wellness}
            </p>

            <p className="text-gray-500 mt-2">
              {getScoreLabel(wellness)}
            </p>

            <ProgressBar value={wellness} />
          </div>

          <div className="bg-red-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Stress
            </p>

            <p className={`text-3xl font-bold ${getStressColor(stress)}`}>
              {Math.round(stress)}
            </p>

            <p className="text-gray-500 mt-2">
              {getScoreLabel(100 - stress)}
            </p>

            <ProgressBar value={100 - stress} />
          </div>

          <div className="bg-green-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Mood
            </p>

            <p className={`text-3xl font-bold ${getMoodColor(mood)}`}>
              {Math.round(mood)}
            </p>

            <p className="text-gray-500 mt-2">
              {getScoreLabel(mood)}
            </p>

            <ProgressBar value={mood} />
          </div>

          <div className="bg-purple-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Productivity
            </p>

            <p className={`text-3xl font-bold ${getProductivityColor(productivity)}`}>
              {Math.round(productivity)}
            </p>

            <p className="text-gray-500 mt-2">
              {getScoreLabel(productivity)}
            </p>

            <ProgressBar value={productivity} />
          </div>

          </div>

          {/* AI Suggestions */}

          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm flex-1">

            <h4 className="font-bold text-xl mb-4">
              💡 Suggestions
            </h4>

            <ul className="space-y-3 text-gray-700">

              {sleep < 8 && (
                <li>
                  😴 Sleep at least 8 hours to improve mood and reduce stress.
                </li>
              )}

              {study > 6 && (
                <li>
                  📚 Schedule 10–15 minute breaks after every 2 hours of study.
                </li>
              )}

              {exercise < 4 && (
                <li>
                  🏃 Aim for 4–5 workout sessions each week.
                </li>
              )}

              {meditation < 15 && (
                <li>
                  🧘 Increase meditation to around 15–20 minutes daily.
                </li>
              )}

              {stress > 60 && (
                <li>
                  ⚠ Your predicted stress is high. Prioritize sleep and relaxation.
                </li>
              )}

              {productivity < 70 && (
                <li>
                  🎯 Improving sleep and regular exercise can significantly boost productivity.
                </li>
              )}

              {sleep >= 8 &&
                study <= 6 &&
                exercise >= 4 &&
                meditation >= 15 && (
                  <li className="font-semibold text-green-600">
                    ✅ Excellent balance! Keep maintaining these healthy habits.
                  </li>
              )}

            </ul>

          </div>
                    <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              Adjust the sliders to simulate how lifestyle changes can
              influence your mental wellbeing and productivity.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WhatIfSimulator;