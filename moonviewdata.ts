import dayjs from 'dayjs';
// 类型定义
export interface CellData {
  rowIndex: number;
  colIndex: number;
  type: 'title' | 'roomtype' | 'room' | 'date' | 'order' | 'normalpanel';
  title?: string;
  roomtype?: string;
  roomno?: string;
  dateSmall?: string;
  week?: string;
  fullDate?: string; // 完整日期（用于hover提示）
  hasorder?: boolean;
  order?: {
    id: string;
    roomId: string;
    checkin: dayjs.Dayjs;
    checkout: dayjs.Dayjs;
    netaboutplatform: number;
    ordername?: string;
  };
  colSpan?: number;
  rowSpan?: number;
  deleted?: boolean;
  isStart?: boolean; // 是否订单起始单元格
  isEnd?: boolean; // 是否订单结束单元格
}

export interface Order {
  id: string;
  roomId: string;
  checkin: dayjs.Dayjs;
  checkout: dayjs.Dayjs;
  netaboutplatform: number;
  ordername?: string;
}

export interface Room {
  id: string;
  roomno: string;
  roomtype: string;
  sort: number;
}

export interface HoverInfo {
  cell?: CellData;
  orderId?: string;
}

  // 模拟数据
export  const mockRooms: Room[] = [
    { id: '1', roomno: '101', roomtype: '标准间', sort: 1 },
    { id: '2', roomno: '102', roomtype: '标准间', sort: 2 },
    { id: '3', roomno: '201', roomtype: '大床房', sort: 3 },
    { id: '4', roomno: '202', roomtype: '大床房', sort: 4 },
    { id: '5', roomno: '301', roomtype: '套房', sort: 5 },
  ];

export const mockOrders: Order[] = [
    {
      id: 'order1',
      roomId: '1',
      checkin: dayjs().add(1, 'day'),
      checkout: dayjs().add(3, 'day'), // 跨2天（1-3日，共2晚）
      netaboutplatform: 1,
      ordername: '张三'
    },
    {
      id: 'order2',
      roomId: '3',
      checkin: dayjs().add(2, 'day'),
      checkout: dayjs().add(5, 'day'), // 跨3天（2-5日，共3晚）
      netaboutplatform: 2,
      ordername: '李四'
    },
    {
      id: 'order3',
      roomId: '5',
      checkin: dayjs().add(4, 'day'),
      checkout: dayjs().add(6, 'day'), // 跨2天（4-6日，共2晚）
      netaboutplatform: 3,
      ordername: '王五'
    },
  ];

  // 黑金配色方案
export const colorScheme = {
    black: '#222222',
    gold: '#d4af37',
    darkGray: '#333333',
    lightGold: '#f0e68c',
    border: '#666666',
    borderHighlight: '#d4af37', // 悬停高亮边框
    order: {
      ctrip: '#b8860b',
      meituan: '#daa520',
      fliggy: '#f0e68c'
    }
  };

