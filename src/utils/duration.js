/**
 * Calculate human-readable lease duration between start and end date strings (YYYY-MM-DD)
 */
export const calculateLeaseDuration = (startStr, endStr) => {
  if (!startStr || !endStr) return 'N/A';

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Invalid Dates';
  if (end < start) return 'Invalid Range';

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (totalDays === 0) return 'Same Day';
  if (totalDays < 7) {
    return `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;
  }

  // Weeks check
  if (totalDays < 30) {
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    if (remDays === 0) {
      return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    }
    return `${weeks}w ${remDays}d`;
  }

  // Months & Years check
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDay = end.getDate();

  let monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
  if (endDay < startDay) {
    monthDiff--;
  }

  if (monthDiff < 12) {
    const months = Math.max(1, monthDiff);
    return `${months} ${months === 1 ? 'Month' : 'Months'} (${totalDays} Days)`;
  }

  const years = Math.floor(monthDiff / 12);
  const remMonths = monthDiff % 12;

  if (remMonths === 0) {
    return `${years} ${years === 1 ? 'Year' : 'Years'} (${totalDays} Days)`;
  }

  return `${years}y ${remMonths}m (${totalDays} Days)`;
};
