import React from 'react';
import { useTheme } from '../context/ThemeContext';

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
  colorA,
  colorB,
}) => {
  const { isDark } = useTheme();

  // Zed editor dark theme colors vs light theme palette
  const effectiveColorA = colorA || (isDark ? '#56b6c2' : '#4d857c'); // Zed Cyan vs Forest Teal
  const effectiveColorB = colorB || (isDark ? '#e5c07b' : '#c7945d'); // Zed Peach vs Warm Amber
  const effectiveColorCommon = isDark ? '#98c379' : '#2f855a'; // Zed Mint vs Deep Emerald

  // Distance between circle centers depends slightly on overlap %:
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
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity={isDark ? "0.25" : "0.08"} />
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
            fill={effectiveColorA}
            opacity={isDark ? "0.82" : "0.88"}
            className="transition-all duration-300"
          />

          {/* Circle B */}
          <circle
            cx={cx2}
            cy={cy}
            r={r}
            fill={effectiveColorB}
            opacity={isDark ? "0.82" : "0.88"}
            className="transition-all duration-300"
          />

          {/* Intersection: circle B clipped by circle A */}
          <g clipPath="url(#circle-a-clip)">
            <circle
              cx={cx2}
              cy={cy}
              r={r}
              fill={effectiveColorCommon}
              opacity={isDark ? "0.95" : "0.95"}
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
            className="font-bold select-none pointer-events-none drop-shadow-sm font-mono"
            style={{ fontWeight: 800, fontSize: '18px' }}
          >
            {overlapPercent}%
          </text>
          <text
            x={200}
            y={cy + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.95)"
            className="select-none pointer-events-none font-medium"
            style={{ fontSize: '11px' }}
          >
            {commonStocksCount} common
          </text>
        </svg>
      </div>

      {/* Legend below the Venn diagram */}
      <div className="flex flex-col gap-2.5 mt-2 text-xs text-slate-700 dark:text-slate-300 w-full max-w-[360px] px-4">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: effectiveColorA }}
          />
          <span className="truncate font-medium text-slate-800 dark:text-slate-200" title={fundAName}>
            {fundAName}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: effectiveColorB }}
          />
          <span className="truncate font-medium text-slate-800 dark:text-slate-200" title={fundBName}>
            {fundBName}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: effectiveColorCommon }}
          />
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Common holdings ({overlapPercent}% overlap)
          </span>
        </div>
      </div>
    </div>
  );
};
