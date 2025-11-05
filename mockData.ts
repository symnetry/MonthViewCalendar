import dayjs from 'dayjs';
import { Room, Order } from './types';

// 模拟房间数据
export const mockRooms: Room[] = [
  { id: '1', roomno: '101', roomtype: '标准间', sort: 1 },
  { id: '2', roomno: '102', roomtype: '标准间', sort: 2 },
  { id: '3', roomno: '201', roomtype: '大床房', sort: 3 },
  { id: '4', roomno: '202', roomtype: '大床房', sort: 4 },
  { id: '5', roomno: '301', roomtype: '套房', sort: 5 },
];

// 模拟订单数据
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