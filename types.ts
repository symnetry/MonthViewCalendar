import { Moment } from 'moment';

// 房间类型
export interface Room {
  id: string;
  roomno: string;
  roomtype: string;
  sort: number;
}

// 订单类型
export interface Order {
  id: string;
  roomId: string;
  checkin: Moment;
  checkout: Moment;
  netaboutplatform: number;
  ordername?: string;
}

// 单元格数据类型
// export interface CellData {
//   rowIndex: number;
//   colIndex: number;
//   type: 'title' | 'roomtype' | 'room' | 'date' | 'order' | 'normalpanel';
//   title?: string;
//   roomtype?: string;
//   roomno?: string;
//   dateSmall?: string;
//   week?: string;
//   fullDate?: string;
//   hasorder?: boolean;
//   order?: Order;
//   colSpan?: number;
//   rowSpan?: number;
//   deleted?: boolean;
//   isStart?: boolean;
//   isEnd?: boolean;
// }

export interface CellData {
  rowIndex: number;
  colIndex: number;
  type: 'title' | 'roomtype' | 'room' | 'date' | 'order' | 'normalpanel';
  title?: string;
  roomtype?: string;
  roomno?: string;
  dateSmall?: string;
  week?: string;
  fullDate?: string;
  hasorder?: boolean;
  order?: {
    id: string;
    roomId: string;
    checkin: Moment;
    checkout: Moment;
    netaboutplatform: number;
    ordername?: string;
  };
  colSpan?: number;
  rowSpan?: number;
  deleted?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}

// 悬停信息类型
export interface HoverInfo {
  cell?: CellData;
  orderId?: string;
}

// 订单位置映射类型
export interface OrderPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  order: Order;
}

// 月视图日历组件属性
export interface MonthViewCalendarProps {
  defaultDates?: [Moment, Moment];
  onDateChange?: (dates: [Moment, Moment]) => void;
  onOrderSelect?: (orderId: string) => void;
  onCellSelect?: (cell: CellData) => void;
}