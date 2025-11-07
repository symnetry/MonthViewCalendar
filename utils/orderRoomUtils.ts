import { CellData, Room, Order } from '../types';
import dayjs from 'dayjs';

// 建立房间ID到行索引的映射
export const buildRoomIndexMap = (rooms: Room[]): Map<string, number> => {
  const map = new Map<string, number>();
  rooms.forEach((room, index) => {
    map.set(room.id, index + 1); // 行索引从1开始（跳过标题行）
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

// 订单匹配到单元格 - 优化版本
export const matchOrdersToCells = (
  sdata: CellData[][],
  orders: Order[],
  startDate: dayjs.Dayjs,
  // 添加可选的rooms参数，避免重复构建房间数据
  rooms?: Room[]
): CellData[][] => {
  // 首先建立房间ID到行索引的映射
  // 如果提供了rooms参数，直接使用它；否则从sdata中提取
  let roomIndexMap: Map<string, number>;
  
  if (rooms && rooms.length > 0) {
    // 直接使用提供的rooms参数构建映射
    roomIndexMap = buildRoomIndexMap(rooms);
  } else {
    // 从sdata中提取房间信息
    const extractedRooms: Room[] = [];
    for (let i = 1; i < sdata.length; i++) {
      const cell = sdata[i]?.[0];
      if (cell && cell.roomno) {
        // 使用正确的属性名
        extractedRooms.push({ id: cell.roomno, roomtype: cell.roomtype || '', roomno: cell.roomno });
      }
    }
    roomIndexMap = buildRoomIndexMap(extractedRooms);
  }

  // 预计算第一列的偏移量（跳过标题和房型列）
  const dateColumnOffset = 2;
  
  // 优化订单处理逻辑
  orders.forEach(order => {
    // 使用正确的属性名roomId而不是roomid
    const rowIndex = roomIndexMap.get(order.roomId);
    if (rowIndex === undefined) return;

    // 确保日期字段是dayjs对象，即使它们是ISO字符串格式
    const orderCheckIn = order.checkin.startOf('day');
    const orderCheckOut = order.checkout.startOf('day');
    
    // 计算订单入住日期相对于月历开始日期的天数差
    const daysFromStart = orderCheckIn.diff(startDate, 'days');
    
    // 计算订单在表格中的起始列索引
    const startColIndex = dateColumnOffset + daysFromStart;
    
    // 计算订单持续天数
    const orderDuration = orderCheckOut.diff(orderCheckIn, 'days');
    
    // 获取当前行的数据，避免重复访问sdata[rowIndex]
    const rowData = sdata[rowIndex];
    if (!rowData) return;

    // 处理订单的每一天
    for (let dayOffset = 0; dayOffset < orderDuration; dayOffset++) {
      const currentColIndex = startColIndex + dayOffset;
      
      // 边界检查 - 对于跨天订单，即使超出当前行范围也应该处理
      if (currentColIndex >= rowData.length) continue;

      const targetCell = rowData[currentColIndex];
      if (!targetCell) continue;

      if (dayOffset === 0) {
        // 订单第一天单元格
        targetCell.hasorder = true;
        targetCell.order = order;
        targetCell.type = 'order';
        targetCell.colSpan = orderDuration; // 使用colSpan而不是panel
        targetCell.isStart = true; // 添加起始单元格标记
        
        // 确保所有订单单元格都有相同的订单引用（用于跨天渲染检测）
        targetCell.orderRef = order.id;
      } else if (dayOffset === orderDuration - 1) {
        // 订单最后一天单元格
        targetCell.type = 'order'; // 保留order类型，不删除，用于渲染检测
        targetCell.hasorder = true;
        targetCell.order = order;
        targetCell.isEnd = true; // 添加结束单元格标记
        targetCell.orderRef = order.id;
      } else {
        // 订单中间天数的单元格
        targetCell.type = 'order'; // 保留order类型，不删除，用于渲染检测
        targetCell.hasorder = true;
        targetCell.order = order;
        targetCell.orderRef = order.id;
      }
    }
  });

  return sdata; // 返回修改后的数组
};