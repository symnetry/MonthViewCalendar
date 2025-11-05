import { colorScheme } from '../constants';

// OTA平台配置
const otaPlatforms = [
  { value: 1, label: '携程', color: colorScheme.order.ctrip },
  { value: 2, label: '美团', color: colorScheme.order.meituan },
  { value: 3, label: '飞猪', color: colorScheme.order.fliggy }
];

// 获取平台名称
export const getPlatformName = (platform: number): string => {
  return otaPlatforms.find(item => item.value === platform)?.label || '未知平台';
};

// 获取订单颜色
export const getOrderColor = (platform: number): string => {
  return otaPlatforms.find(item => item.value === platform)?.color || colorScheme.gold;
};