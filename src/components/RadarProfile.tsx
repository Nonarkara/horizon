import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { Dimension } from '../types';
import { dimensions } from '../data/scenarios';

interface RadarProfileProps {
  scores: Record<Dimension, { score: number; max: number }>;
}

export function RadarProfile({ scores }: RadarProfileProps) {
  const data = dimensions.map((d) => ({
    dimension: d.shortName,
    fullMark: 100,
    score: scores[d.id] ? Math.round((scores[d.id].score / scores[d.id].max) * 100) : 0,
    color: d.color,
  }));

  const hasData = data.some((d) => d.score > 0);

  if (!hasData) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-text-tertiary text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'rgba(240,240,245,0.5)', fontSize: 11, fontFamily: 'Inter' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'rgba(240,240,245,0.2)', fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Profile"
            dataKey="score"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="rgba(0, 240, 255, 0.1)"
            fillOpacity={1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
