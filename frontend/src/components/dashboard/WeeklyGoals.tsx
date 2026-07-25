import { useState } from "react";
import { motion } from "framer-motion";

type Goal = {
  id: number;
  title: string;
  completed: number;
  target: number;
  xp: number;
};

const WeeklyGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Sleep 8 Hours",
      completed: 5,
      target: 7,
      xp: 40,
    },
    {
      id: 2,
      title: "Meditation",
      completed: 6,
      target: 7,
      xp: 30,
    },
    {
      id: 3,
      title: "Exercise",
      completed: 3,
      target: 5,
      xp: 50,
    },
    {
      id: 4,
      title: "Study 2 Hours",
      completed: 4,
      target: 7,
      xp: 60,
    },
  ]);

  const completeGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id && goal.completed < goal.target
          ? { ...goal, completed: goal.completed + 1 }
          : goal
      )
    );
  };

  const totalXP = goals.reduce((sum, goal) => sum + goal.xp, 0);

  const completion =
    Math.round(
      (goals.reduce((sum, goal) => sum + goal.completed, 0) /
        goals.reduce((sum, goal) => sum + goal.target, 0)) *
        100
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          🎯 Weekly Goals
        </h2>

        <span className="text-sm text-gray-500">
          Week 3
        </span>
      </div>

      {goals.map((goal) => {
        const progress = (goal.completed / goal.target) * 100;
        const progressColor =progress >= 70
            ? "from-green-400 to-green-600"
            : progress >= 40
            ? "from-yellow-400 to-orange-500"
            : "from-red-400 to-red-600";

        return (
          <div key={goal.id} className="mb-6">

            <div className="flex justify-between mb-2">
              <span className="font-medium">
                {goal.title}
              </span>

              <span className="text-sm text-gray-500">
                {goal.completed}/{goal.target}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7 }}
                className={`h-3 rounded-full bg-gradient-to-r ${progressColor}`}
              />

            </div>

            <div className="flex justify-between mt-2">

              <span className="text-xs text-gray-500">
                +{goal.xp} XP
              </span>

              <button
                disabled={goal.completed >= goal.target}
                onClick={() => completeGoal(goal.id)}
                className={`text-xs px-3 py-1 rounded-full text-white transition ${
                    goal.completed >= goal.target
                        ? "bg-green-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                }`}
            >
                {goal.completed >= goal.target ? "Completed ✓" : "Complete"}
              </button>

            </div>

          </div>
        );
      })}

      <div className="border-t pt-4 mt-2 flex justify-between text-sm">

        <div>
          🔥 Streak <b>6 Days</b>
        </div>

        <div>
          ⭐ {totalXP} XP
        </div>

        <div>
          🏆 {completion}%
        </div>

      </div>
    </div>
  );
};

export default WeeklyGoals;