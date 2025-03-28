// utils/timeUtils.js
export function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    const diffInMs = endTime - startTime;
    return Math.floor(diffInMs / 1000); // Return duration in seconds
  }