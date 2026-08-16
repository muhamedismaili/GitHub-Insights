"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type CommitWeek = {
  week: number;
  total: number;
};

export default function CommitActivityChart({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [data, setData] = useState<CommitWeek[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/github/commit-activity?owner=${owner}&repo=${repo}`,
      );

      if (res.status === 202) {
        setPending(true);
        return;
      }

      if (!res.ok) {
        setError("Couldn't load commit activity.");
        return;
      }

      const raw: CommitWeek[] = await res.json();
      setData(raw.slice(-10));
    }

    load();
  }, [owner, repo]);

  if (error) {
    return <p className="text-xs text-red-600">{error}</p>;
  }

  if (pending) {
    return (
      <p className="text-xs text-zinc-500">
        Computing stats, refresh shortly...
      </p>
    );
  }

  if (!data) {
    return <p className="text-xs text-zinc-500">Loading...</p>;
  }

  const chartData = data.map((w) => ({
    week: new Date(w.week * 1000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    commits: w.total,
  }));

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 9 }}
            interval={0}
            angle={0}
            height={40}
          />
          <YAxis hide />
          <Bar dataKey="commits" fill="#18181b" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
