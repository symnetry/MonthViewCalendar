import { CellData, Room, Order } from '../types';
import { Moment } from 'moment';

// 建立房间ID到行索引的映射
export const buildRoomIndexMap = (rooms: Room[]): Map<string, number> => {
  const map = new Map<string, number>();
  rooms.forEach((room, index) => {
    map.set(room._id, index + 1); // 行索引从1开始（跳过标题行）
  });
  return map;
};

// 房型合并处理
export const processRoomTypeMerge = (sdata: CellData[][]): CellData[][] => {
  const roomTypeMap = new Map<string, { startRow: number; count: number }>();

  // 统计相同房型的行数
  for (let i = 1; i < sdata.length; i++) {
    const roomTypeCell = sdata[i]?.[0];
    if (roomTypeCell?.type === 'roomtype' && roomTypeCell.roomtype) {
      const roomType = roomTypeCell.roomtype;
      if (roomTypeMap.has(roomType)) {
        roomTypeMap.get(roomType)!.count++;
      } else {
        roomTypeMap.set(roomType, { startRow: i, count: 1 });
      }
    }
  }

  // 设置rowSpan并隐藏重复房型的单元格
  roomTypeMap.forEach((value, roomType) => {
    const { startRow, count } = value;
    if (sdata[startRow]) {
      sdata[startRow][0].rowSpan = count;
    }
    for (let i = startRow + 1; i < startRow + count; i++) {
      if (sdata[i]) sdata[i][0].deleted = true;
    }
  });

  return sdata;
};

// 订单匹配到单元格
export const matchOrdersToCells = (
  sdata: CellData[][],
  orders: Order[],
  startDate: Moment
): void => {
  const roomIndexMap = buildRoomIndexMap(sdata as unknown as Room[]); // 实际应传入rooms参数

  orders.forEach(order => {
    const rowIndex = roomIndexMap.get(order.roomid);
    if (rowIndex === undefined) return;

    const orderCheckInMoment = moment(order.checkintime).startOf('day');
    const daysFromStart = orderCheckInMoment.diff(startDate, 'days');
    const startColIndex = 2 + daysFromStart;
    const orderDuration = Math.ceil((order.checkouttime - order.checkintime) / (24 * 60 * 60 * 1000));

    for (let dayOffset = 0; dayOffset < orderDuration; dayOffset++) {
      const currentColIndex = startColIndex + dayOffset;
      if (currentColIndex >= sdata[0].length) break;

      const targetCell = sdata[rowIndex]?.[currentColIndex];
      if (!targetCell) continue;

      if (dayOffset === 0) {
        targetCell.hasorder = true;
        targetCell.order = order;
        targetCell.type = 'order';
        targetCell.panel = orderDuration;
      } else {
        targetCell.deleted = true;
        targetCell.linkedOrderId = order._id;
      }
    }
  });
};