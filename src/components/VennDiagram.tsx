import React from 'react';

interface VennDiagramProps {
  fundAName: string;
  fundBName: string;
  overlapPercent: number;
  commonStocksCount: number;
  totalUniqueCount: number;
  colorA?: string;
  colorB?: string;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({
  fundAName,
  fundBName,
  overlapPercent,
  commonStocksCount,
  colorA = '#4d857c',
  colorB = '#c7945d',
}) => {
  // Distance between circle centers depends slightly on overlap %:
  // High overlap (e.g. 50%) -> circles closer (e.g. dx = 70)
  // Low overlap (e.g. 10%) -> circles further (e.g. dx = 130)
  const clampedOverlap = Math.max(5, Math.min(80, overlapPercent));
  const centerDistance = 145 - (clampedOverlap / 100) * 80;

  const cx1 = 200 - centerDistance / 2;
  const cx2 = 200 + centerDistance / 2;
  const cy = 130;
  const r = 85;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
        <svg viewBox="0 0 400 260" className="w-full h-full drop-shadow-sm select-none">
          <defs>
            <filter id="venn-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.08" />
            </filter>
            {/* Intersection clip path */}
            <clipPath id="circle-a-clip">
              <circle cx={cx1} cy={cy} r={r} />
            </clipPath>
          </defs>

          {/* Circle A */}
          <circle
            cx={cx1}
            cy={cy}
            r={r}
            fill={colorA}
            opacity="0.88"
            className="transition-all duration-300"
          />

          {/* Circle B */}
          <circle
            cx={cx2}
            cy={cy}
            r={r}
            fill={colorB}
            opacity="0.88"
            className="transition-all duration-300"
          />

          {/* Intersection: circle B clipped by circle A */}
          <g clipPath="url(#circle-a-clip)">
            <circle
              cx={cx2}
              cy={cy}
              r={r}
              fill="#2f855a"
              opacity="0.95"
              className="transition-all duration-300"
            />
          </g>

          {/* Center Overlap Label */}
          <text
            x={200}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            className="font-bold text-lg select-none pointer-events-none drop-shadow-sm"
            style={{ fontWeight: 800, fontSize: '18px' }}
          >
            {overlapPercent}%
          </text>
          <text
            x={200}
            y={cy + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.9)"
            className="text-xs select-none pointer-events-none font-medium"
            style={{ fontSize: '10px' }}
          >
            {commonStocksCount} common
          </text>
        </svg>
      </div>

      {/* Legend below the Venn diagram matching screenshot style */}
      <div className="flex flex-col gap-2.5 mt-2 text-xs text-slate-700 w-full max-w-[360px] px-4">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: colorA }} />
          <span className="truncate font-medium text-slate-800" title={fundAName}>
            {fundAName}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: colorB }} />
          <span className="truncate font-medium text-slate-800" title={fundBName}>
            {fundBName}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full shrink-0 bg-emerald-700" />
          <span className="text-slate-600 font-medium">Common holdings ({overlapPercent}% overlap)</span>
        </div>
      </div>
    </div>
  );
};
