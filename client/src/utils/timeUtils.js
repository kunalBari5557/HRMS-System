// utils/timeUtils.js
export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const diffInMs = endTime - startTime;
  return Math.floor(diffInMs / 1000); // Return duration in seconds
}

export const calculateWorkTime = (totalHours, breakHours) => {
  if (!totalHours || !breakHours) return "00:00:00";

  const [totalH, totalM, totalS] = totalHours.split(":").map(Number);
  const [breakH, breakM, breakS] = breakHours.split(":").map(Number);

  let totalSeconds = totalH * 3600 + totalM * 60 + totalS;
  let breakSeconds = breakH * 3600 + breakM * 60 + breakS;
  let workSeconds = totalSeconds - breakSeconds;

  if (workSeconds < 0) return "00:00:00"; // Prevent negative values

  const workH = String(Math.floor(workSeconds / 3600)).padStart(2, "0");
  const workM = String(Math.floor((workSeconds % 3600) / 60)).padStart(2, "0");
  const workS = String(workSeconds % 60).padStart(2, "0");

  return `${workH}:${workM}:${workS}`;
};
