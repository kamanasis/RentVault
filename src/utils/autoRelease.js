/**
 * Auto-Release Policy Duration Helper Utility
 */

export const AUTO_RELEASE_PRESETS = [
  { id: '1_min', label: '1 Minute (Demo)', duration: 1, unit: 'minutes', milliseconds: 60 * 1000 },
  { id: '5_min', label: '5 Minutes', duration: 5, unit: 'minutes', milliseconds: 5 * 60 * 1000 },
  { id: '15_min', label: '15 Minutes', duration: 15, unit: 'minutes', milliseconds: 15 * 60 * 1000 },
  { id: '30_min', label: '30 Minutes', duration: 30, unit: 'minutes', milliseconds: 30 * 60 * 1000 },
  { id: '1_hour', label: '1 Hour', duration: 1, unit: 'hours', milliseconds: 60 * 60 * 1000 },
  { id: '6_hours', label: '6 Hours', duration: 6, unit: 'hours', milliseconds: 6 * 60 * 60 * 1000 },
  { id: '12_hours', label: '12 Hours', duration: 12, unit: 'hours', milliseconds: 12 * 60 * 60 * 1000 },
  { id: '24_hours', label: '24 Hours (1 Day)', duration: 24, unit: 'hours', milliseconds: 24 * 60 * 60 * 1000 },
  { id: '48_hours', label: '48 Hours (2 Days)', duration: 48, unit: 'hours', milliseconds: 48 * 60 * 60 * 1000 },
  { id: '3_days', label: '3 Days', duration: 3, unit: 'days', milliseconds: 3 * 24 * 60 * 60 * 1000 },
  { id: '7_days', label: '7 Days (Default)', duration: 7, unit: 'days', milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { id: '14_days', label: '14 Days (2 Weeks)', duration: 14, unit: 'days', milliseconds: 14 * 24 * 60 * 60 * 1000 },
  { id: '30_days', label: '30 Days (1 Month)', duration: 30, unit: 'days', milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { id: 'custom', label: 'Custom Duration', duration: 0, unit: 'custom', milliseconds: 0 },
];

/**
 * Calculates milliseconds from custom duration and unit
 */
export const calculateAutoReleaseMs = (duration, unit) => {
  const num = Math.max(1, parseFloat(duration) || 1);
  switch (unit) {
    case 'minutes': return num * 60 * 1000;
    case 'hours': return num * 60 * 60 * 1000;
    case 'days': return num * 24 * 60 * 60 * 1000;
    case 'weeks': return num * 7 * 24 * 60 * 60 * 1000;
    default: return num * 24 * 60 * 60 * 1000;
  }
};

/**
 * Formats milliseconds into human readable countdown text (e.g. 6d 23h, 2h 15m, 45s)
 */
export const formatAutoReleaseCountdown = (msRemaining) => {
  if (msRemaining <= 0) return 'Completed';

  const totalSec = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSec / (24 * 3600));
  const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

/**
 * Formats policy label (e.g., "7 Days", "1 Minute (Demo)")
 */
export const getAutoReleasePolicyLabel = (autoReleaseObj) => {
  if (!autoReleaseObj) return '7 Days (Default)';
  if (autoReleaseObj.preset && autoReleaseObj.preset !== 'custom') {
    const found = AUTO_RELEASE_PRESETS.find((p) => p.id === autoReleaseObj.preset);
    if (found) return found.label;
  }
  return `${autoReleaseObj.duration} ${autoReleaseObj.unit}`;
};
