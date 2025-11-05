import { Order, CellData } from '../types';
import dayjs from 'dayjs';

/**
 * 检查选择区域是否包含订单
 */
export const checkIfSelectionContainsOrder = (selectedCells: CellData[]): boolean => {
  if (!selectedCells.length) return false;
  
  // 简单实现：检查是否有单元格已经被标记为订单
  return selectedCells.some(cell => cell.type === 'order' && cell.hasorder);
};

/**
 * 检查新订单是否与现有订单冲突
 * @param roomIds 要预订的房间ID数组
 * @param dateRange 预订日期范围 [checkin, checkout]
 * @param existingOrders 现有订单列表
 * @returns 冲突的房间ID数组
 */
export const checkOrderConflict = (
  roomIds: string[],
  dateRange: [dayjs.Dayjs, dayjs.Dayjs],
  existingOrders: Order[]
): string[] => {
  const [newCheckin, newCheckout] = dateRange;
  const conflictingRooms: string[] = [];
  
  // 检查每个要预订的房间
  roomIds.forEach(roomId => {
    // 查找该房间的现有订单
    const roomOrders = existingOrders.filter(order => order.roomId === roomId);
    
    // 检查是否有冲突
    const hasConflict = roomOrders.some(order => {
      // 新订单的入住日期小于现有订单的退房日期
      // 并且新订单的退房日期大于现有订单的入住日期
      return newCheckin.isBefore(order.checkout) && newCheckout.isAfter(order.checkin);
    });
    
    if (hasConflict) {
      conflictingRooms.push(roomId);
    }
  });
  
  return conflictingRooms;
};

/**
 * 计算订单的入住天数
 * @param checkin 入住日期
 * @param checkout 退房日期
 * @returns 入住天数
 */
export const calculateStayDays = (checkin: dayjs.Dayjs, checkout: dayjs.Dayjs): number => {
  return checkout.diff(checkin, 'days');
};

/**
 * 格式化订单信息为显示文本
 * @param order 订单对象
 * @returns 格式化后的文本
 */
export const formatOrderInfo = (order: Order): string => {
  return `${order.ordername || '无名订单'} - ${order.checkin.format('YYYY-MM-DD')} 至 ${order.checkout.format('YYYY-MM-DD')}`;
};