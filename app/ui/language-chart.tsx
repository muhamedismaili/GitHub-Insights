"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#6366f1",
  "#f97316", 
  "#14b8a6", 
  "#e11d48", 
  "#eab308", 
  "#0ea5e9", 
];

export default function LanguageChart({
  languages,
}: {
  languages: Record<string, number>;
}) {
  const data = Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (data.length === 0) {
    return <p className="mt-4 text-zinc-500">No language data yet.</p>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 p-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-zinc-700">{item.name}</span>
            </div>
            <span className="text-zinc-500">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}