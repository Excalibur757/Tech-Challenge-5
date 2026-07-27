// components/tasks/TaskStats.tsx
"use client";

interface TaskStatsProps {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  completionRate: number;
}

export function TaskStats({
  totalTasks,
  activeTasks,
  completedTasks,
  completionRate,
}: TaskStatsProps) {
  const stats = [
    { label: "Total", value: totalTasks, color: "text-blue-600" },
    { label: "Pendentes", value: activeTasks, color: "text-yellow-600" },
    { label: "Concluídas", value: completedTasks, color: "text-green-600" },
    { label: "Progresso", value: `${completionRate}%`, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}