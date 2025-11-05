// OTA平台配置
// export const otaPlatformEnum = [
//   { value: 1, label: '携程', color: '#1890ff' },
//   { value: 2, label: '美团', color: '#52c41a' },
//   { value: 3, label: '飞猪', color: '#faad14' }
// ];

import { otaPlatformEnum } from '../utils/utils';

// 获取平台名称
export const getPlatformName = (platform: number): string => {
  return otaPlatformEnum.find(p => p.value === platform)?.label || '未知平台';
};

// 获取订单颜色
export const getOrderColor = (platform: number): string => {
  return otaPlatformEnum.find(p => p.value === platform)?.color || '#1890ff';
};