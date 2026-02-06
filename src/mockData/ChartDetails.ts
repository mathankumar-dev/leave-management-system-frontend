import type { ChartData } from "../features/dashboard/types";


const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const getLastThreeMonthsData = (data: ChartData[]): ChartData[] => {
  const currentMonthIndex = new Date().getMonth(); // 0 = Jan

  const requiredMonths = [
    MONTHS[(currentMonthIndex - 2 + 12) % 12],
    MONTHS[(currentMonthIndex - 1 + 12) % 12],
    MONTHS[currentMonthIndex],
  ];

  return data.filter(item => requiredMonths.includes(item.month));
};
