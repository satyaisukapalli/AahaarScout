import React, { useState } from 'react';
import { Restaurant } from '../types';
import { calculateCrowdInfo, CrowdLevel } from '../utils/crowdMeter';

interface CrowdMeterProps {
  restaurant: Restaurant;
  variant?: 'compact' | 'badge' | 'detailed';
  simulatedHour?: number;
  showHourlyHistogram?: boolean;
  className?: string;
}

export const CrowdMeter: React.FC<CrowdMeterProps> = ({
  restaurant,
  variant = 'compact',
  simulatedHour,
  showHourlyHistogram = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const crowd = calculateCrowdInfo(restaurant, simulatedHour);

  // 3-Bar Signal Indicator calculation
  // Low = 1 bar, Medium = 2 bars, High = 3 bars
  const activeBars = crowd.level === 'low' ? 1 : crowd.level === 'medium' ? 2 : 3;

  const barColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-rose-500',
  }[crowd.level];

  const dotColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-rose-500',
  }[crowd.level];

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-grotesk font-bold border shadow-2xs ${crowd.statusBadgeColor.bg} ${crowd.statusBadgeColor.border} ${className}`}
        title={`Crowd: ${crowd.label} (${crowd.percentage}% busy) • ${crowd.waitTime}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors} ${crowd.level === 'high' ? 'animate-ping' : ''}`} />
        <span>Crowd: {crowd.label}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-grotesk font-bold border transition-all ${crowd.statusBadgeColor.bg} ${crowd.statusBadgeColor.border} shadow-2xs hover:shadow-xs cursor-help`}
        >
          {/* Signal Bars Visual Indicator */}
          <div className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
            <span
              className={`w-[3px] rounded-xs transition-all ${
                activeBars >= 1 ? barColors : 'bg-gray-300'
              } h-1.5`}
            />
            <span
              className={`w-[3px] rounded-xs transition-all ${
                activeBars >= 2 ? barColors : 'bg-gray-300'
              } h-2.5`}
            />
            <span
              className={`w-[3px] rounded-xs transition-all ${
                activeBars >= 3 ? barColors : 'bg-gray-300'
              } h-3.5`}
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#523932] font-semibold text-[11px]">Crowd:</span>
            <span className={`font-bold ${crowd.statusBadgeColor.text}`}>
              {crowd.label}
            </span>
          </div>

          <span className="text-[10px] text-[#785950] font-medium hidden sm:inline border-l border-current/20 pl-1.5 opacity-80">
            {crowd.waitTime.split('•')[0].trim()}
          </span>
        </div>

        {/* Hover / Touch Tooltip with Live Breakdown */}
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 z-40 w-64 p-3 bg-[#1e110d] text-white rounded-2xl shadow-xl border border-white/20 text-xs font-grotesk pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/15 mb-2">
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${dotColors} animate-pulse`} />
                <span>Live Crowd Status</span>
              </div>
              <span className="text-[10px] text-white/70 font-mono">{crowd.currentHourLabel}</span>
            </div>

            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/80">Occupancy:</span>
              <span className="font-bold text-white">{crowd.percentage}% Full</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColors}`}
                style={{ width: `${crowd.percentage}%` }}
              />
            </div>

            <div className="text-[11px] text-[#ffebe4] mb-1 font-semibold">
              ⏱ {crowd.waitTime}
            </div>
            <div className="text-[10px] text-white/70 italic">
              Best time to visit: {crowd.bestTimeToVisit}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detailed Card View (Used in RestaurantDetailScreen)
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#fff8f5] via-[#fffbf9] to-[#fff5f0] border-2 border-[#ffded4] shadow-xs flex flex-col gap-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ffded4]">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${crowd.statusBadgeColor.bg} border ${crowd.statusBadgeColor.border}`}>
            <span className="material-symbols-outlined text-xl material-symbols-fill text-[#ff4500]">
              people
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-garamond font-bold text-lg text-[#1e110d]">
                Live Crowd Meter
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-grotesk font-bold border ${crowd.statusBadgeColor.bg} ${crowd.statusBadgeColor.border} ${crowd.statusBadgeColor.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors} ${crowd.level === 'high' ? 'animate-ping' : ''}`} />
                <span>{crowd.label} Crowd ({crowd.percentage}%)</span>
              </span>
            </div>
            <p className="font-grotesk text-xs text-[#523932] font-medium">
              Simulated foot traffic at {crowd.currentHourLabel}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs font-grotesk font-bold text-[#1e110d]">
            Estimated Wait
          </div>
          <div className="text-xs font-grotesk font-semibold text-[#e63900]">
            {crowd.waitTime}
          </div>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs font-grotesk font-bold">
          <span className="text-[#523932]">Current Table Occupancy</span>
          <span className={crowd.statusBadgeColor.text}>{crowd.percentage}% Capacity</span>
        </div>
        <div className="w-full bg-[#ffded4]/60 rounded-full h-3 overflow-hidden p-0.5 border border-[#ffcfc2]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColors}`}
            style={{ width: `${crowd.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-grotesk text-[#785950] font-semibold">
          <span>0% (Empty)</span>
          <span>50% (Moderate)</span>
          <span>100% (Full House)</span>
        </div>
      </div>

      {/* AI Timing Advice */}
      <div className="bg-white rounded-xl p-3 border border-[#ffded4] flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#ff4500] text-lg shrink-0 material-symbols-fill">
          schedule
        </span>
        <div className="text-xs font-grotesk">
          <span className="font-bold text-[#1e110d]">Smart Visit Advice: </span>
          <span className="text-[#523932]">{crowd.description} </span>
          <span className="text-[#e63900] font-bold">Recommended window: {crowd.bestTimeToVisit}.</span>
        </div>
      </div>

      {/* Hourly Busyness Timeline Histogram */}
      {showHourlyHistogram && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-xs font-grotesk font-bold text-[#523932]">
            <span>Today's Busyness Pattern</span>
            <span className="text-[11px] font-normal text-[#785950]">8:00 AM – 10:00 PM</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5 items-end h-20 pt-2 pb-1 bg-white rounded-xl p-2.5 border border-[#ffded4]">
            {crowd.hourlyTrends.map((t) => {
              const heightPct = Math.max(15, t.percentage);
              const barBg =
                t.percentage >= 75
                  ? 'bg-rose-400'
                  : t.percentage >= 45
                  ? 'bg-amber-400'
                  : 'bg-emerald-400';

              return (
                <div key={t.hour} className="flex flex-col items-center gap-1 h-full justify-end group/bar relative">
                  <div
                    className={`w-full rounded-t-sm transition-all ${barBg} ${
                      t.isCurrent ? 'ring-2 ring-[#ff4500] brightness-110' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span
                    className={`text-[9px] font-grotesk font-bold ${
                      t.isCurrent ? 'text-[#ff4500] underline' : 'text-[#785950]'
                    }`}
                  >
                    {t.label}
                  </span>

                  {/* Micro hover tooltip on hour bar */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e110d] text-white px-1.5 py-0.5 rounded text-[9px] font-grotesk whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                    {t.percentage}% busy
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
