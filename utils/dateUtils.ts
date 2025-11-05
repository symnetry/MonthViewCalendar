import dayjs from 'dayjs';

// 获取星期文本（如“周日”）
export const getWeekDay = (date: dayjs.Dayjs): string => {
  const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekMap[date.day()];
};

// 计算两个日期之间的天数差（包含首尾）
export const getDaysDiff = (start: dayjs.Dayjs, end: dayjs.Dayjs): number => {
  return end.diff(start, 'days') + 1;
};