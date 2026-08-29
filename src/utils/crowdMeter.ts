import { Restaurant } from '../types';

export type CrowdLevel = 'low' | 'medium' | 'high';

export interface CrowdInfo {
  level: CrowdLevel;
  percentage: number; // 0 to 100
  label: 'Low' | 'Medium' | 'High';
  headline: string;
  waitTime: string;
  description: string;
  bestTimeToVisit: string;
  currentHourLabel: string;
  hourlyTrends: { hour: number; label: string; percentage: number; isCurrent: boolean }[];
  isPeakHour: boolean;
  statusBadgeColor: {
    bg: string;
    border: string;
    text: string;
    barColor: string;
    glow: string;
  };
}

// Determines restaurant archetype to simulate realistic foot traffic
function getRestaurantArchetype(r: Restaurant): 'tiffin' | 'biryani_meals' | 'cafe_bakery' | 'fine_night' {
  const text = `${r.name} ${r.cuisine} ${r.tags.join(' ')} ${r.vibe || ''}`.toLowerCase();
  
  if (text.includes('dosa') || text.includes('idli') || text.includes('tiffin') || text.includes('pesarattu') || text.includes('breakfast') || text.includes('shri sagar') || text.includes('murugan') || text.includes('komala') || text.includes('murali krishna')) {
    return 'tiffin';
  }
  
  if (text.includes('coffee') || text.includes('cafe') || text.includes('patisserie') || text.includes('bakery') || text.includes('dessert') || text.includes('concu') || text.includes('roastery') || text.includes('kashi')) {
    return 'cafe_bakery';
  }
  
  if (text.includes('romantic') || text.includes('bar') || text.includes('brewery') || text.includes('wine') || text.includes('fine dining') || text.includes('toit') || text.includes('osteria') || text.includes('kumi') || text.includes('grasshopper') || text.includes('dakshin')) {
    return 'fine_night';
  }
  
  return 'biryani_meals';
}

// Pseudo-random deterministic hash based on restaurant id to give slight natural variance
function getRestaurantSeedVariance(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 15) - 7; // -7 to +7 variance
}

export function calculateCrowdInfo(restaurant: Restaurant, simulatedHour?: number): CrowdInfo {
  const currentActualDate = new Date();
  const currentHour = simulatedHour !== undefined ? simulatedHour : currentActualDate.getHours();
  const archetype = getRestaurantArchetype(restaurant);
  const variance = getRestaurantSeedVariance(restaurant.id);

  // Hourly base capacity curves (0-23 hours)
  const hourlyCurves: Record<'tiffin' | 'biryani_meals' | 'cafe_bakery' | 'fine_night', number[]> = {
    // Tiffin spots peak 7am-10:30am and 5pm-8pm
    tiffin: [
      5, 5, 5, 5, 10, 25, 60, 92, 96, 88, 70, 50, 45, 40, 35, 30, 45, 78, 88, 82, 60, 35, 15, 5
    ],
    // Biryani & lunch/dinner meals peak 12:30pm-3pm and 7:30pm-10:30pm
    biryani_meals: [
      5, 5, 5, 5, 5, 10, 15, 25, 30, 35, 45, 65, 92, 98, 85, 40, 30, 40, 65, 88, 96, 90, 60, 20
    ],
    // Cafes & dessert bars peak in afternoons 4pm-9pm
    cafe_bakery: [
      5, 5, 5, 5, 5, 5, 10, 20, 35, 50, 55, 55, 60, 60, 65, 75, 90, 94, 90, 85, 70, 45, 20, 10
    ],
    // Romantic fine dining & craft breweries peak in late evening 8pm-11pm
    fine_night: [
      5, 5, 5, 5, 5, 5, 5, 10, 15, 20, 25, 40, 60, 70, 55, 30, 30, 45, 65, 85, 96, 95, 80, 40
    ],
  };

  const curve = hourlyCurves[archetype];
  const basePercentage = curve[currentHour] ?? 50;
  const rawPercentage = Math.min(99, Math.max(10, basePercentage + variance));
  const percentage = Math.round(rawPercentage);

  let level: CrowdLevel = 'low';
  let label: 'Low' | 'Medium' | 'High' = 'Low';
  let headline = 'Calm & Quiet';
  let waitTime = 'No wait • Walk-in ready';
  let description = 'Seating is plentiful with immediate table service.';
  let isPeakHour = false;

  if (percentage >= 75) {
    level = 'high';
    label = 'High';
    headline = 'Peak Rush Hour';
    waitTime = '15–25 min wait';
    description = 'High crowd density. Expect buzzing tables & waitlists.';
    isPeakHour = true;
  } else if (percentage >= 45) {
    level = 'medium';
    label = 'Medium';
    headline = 'Moderate Buzz';
    waitTime = '5–10 min wait';
    description = 'Lively dining room with steady seating flow.';
  }

  // Format 12-hour label for current hour
  const period = currentHour >= 12 ? 'PM' : 'AM';
  const displayHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
  const currentHourLabel = `${displayHour}:00 ${period}`;

  // Best time recommendation
  let bestTimeToVisit = '3:30 PM – 6:00 PM';
  if (archetype === 'tiffin') {
    bestTimeToVisit = '11:30 AM – 4:00 PM (Off-peak tiffins)';
  } else if (archetype === 'cafe_bakery') {
    bestTimeToVisit = '10:00 AM – 1:00 PM (Quiet work/brunch)';
  } else if (archetype === 'fine_night') {
    bestTimeToVisit = '6:30 PM – 7:30 PM (Pre-rush seating)';
  } else {
    bestTimeToVisit = '3:00 PM – 6:30 PM (Quickest service)';
  }

  // Generate 8:00 AM to 11:00 PM trend array for visual timeline
  const displayHours = [8, 10, 12, 14, 16, 18, 20, 22];
  const hourlyTrends = displayHours.map((h) => {
    const p = Math.min(99, Math.max(10, curve[h] + variance));
    const hPeriod = h >= 12 ? 'PM' : 'AM';
    const hNum = h % 12 === 0 ? 12 : h % 12;
    return {
      hour: h,
      label: `${hNum}${hPeriod}`,
      percentage: Math.round(p),
      isCurrent: Math.abs(currentHour - h) <= 1,
    };
  });

  const statusBadgeColor = {
    low: {
      bg: 'bg-emerald-50 text-emerald-800',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      barColor: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20',
    },
    medium: {
      bg: 'bg-amber-50 text-amber-900',
      border: 'border-amber-200',
      text: 'text-amber-700',
      barColor: 'bg-amber-500',
      glow: 'shadow-amber-500/20',
    },
    high: {
      bg: 'bg-rose-50 text-rose-900',
      border: 'border-rose-200',
      text: 'text-rose-700',
      barColor: 'bg-rose-500',
      glow: 'shadow-rose-500/20',
    },
  }[level];

  return {
    level,
    percentage,
    label,
    headline,
    waitTime,
    description,
    bestTimeToVisit,
    currentHourLabel,
    hourlyTrends,
    isPeakHour,
    statusBadgeColor,
  };
}
