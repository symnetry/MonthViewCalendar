import dayjs from 'dayjs';
import { CellData,Room,Order } from './types';
// import { mockRooms, mockOrders } from './mockData';
import { getWeekDay } from './utils/dateUtils';
import { matchOrdersToCells } from './utils/orderRoomUtils';

// 生成月视图数据
export const generateMonthViewData = async (dates: [dayjs.Dayjs, dayjs.Dayjs],rooms:Room[],orders:Order[]): Promise<CellData[][]> => {
	// console.log('开始生成数据:', rooms,orders);
	
	const [sd, ed] = dates;
	const days = ed.diff(sd, 'days') + 1;
	// const rooms = mockRooms;
	// const orders = mockOrders;

	// 初始化数据结构
	let data: CellData[][] = [];
	const rowCount = rooms.length + 1; // 1行标题 + N行房间
	const colCount = days + 1; // 1列房型 + N列日期

	// 填充空数据
	for (let i = 0; i < rowCount; i++) {
		data[i] = [];
		for (let j = 0; j < colCount; j++) {
			data[i][j] = { 
				rowIndex: i, 
				colIndex: j, 
				type: 'normalpanel',
				deleted: false
			};
		}
	}

	// 设置标题行（合并[0][0]和[0][1]）
	data[0][0] = {
		...data[0][0],
		type: 'title',
		title: `${sd.format('YYYY年MM月DD日')}至${ed.format('MM月DD日')}`,
		colSpan: 2,
		deleted: false
	};
	data[0][1] = { ...data[0][1], type: 'title', deleted: true };

	// 设置房型列（合并同房型）
	for (let i = 1; i < rowCount; i++) {
		const currentRoom = rooms[i - 1];
		const sameTypeCount = rooms.filter(room => room.roomtype === currentRoom.roomtype).length;
		
		data[i][0] = {
			...data[i][0],
			type: 'roomtype',
			roomtype: currentRoom.roomtype,
			rowSpan: sameTypeCount,
			deleted: false
		};
		
		if (i > 1 && rooms[i - 1].roomtype === rooms[i - 2].roomtype) {
			data[i][0].deleted = true;
		}
	}

	// 设置日期行（带完整日期信息）
	for (let j = 2; j < colCount; j++) {
		const currentDate = sd.add(j - 2, 'day').clone();
		data[0][j] = {
			...data[0][j],
			type: 'date',
			dateSmall: currentDate.format('MM-DD'),
			week: getWeekDay(currentDate),
			fullDate: currentDate.format('YYYY-MM-DD'),
			deleted: false
		};
	}

	// 设置房间号列和订单（标记跨日期订单）
	for (let i = 1; i < rowCount; i++) {
		const room = rooms[i - 1];
		
		// 房间号列
		data[i][1] = { 
			...data[i][1], 
			type: 'room', 
			roomno: room.roomno,
			deleted: false
		};

		// 日期单元格（仅设置基础日期信息，订单处理由matchOrdersToCells函数完成）
		for (let j = 2; j < colCount; j++) {
			const currentDate = sd.clone().add(j - 2, 'days');
			data[i][j].fullDate = currentDate.format('YYYY-MM-DD');
		}
	}
	
	// 应用优化后的订单匹配算法
	// 使用matchOrdersToCells函数返回的修改后数据
  console.log('之前',JSON.parse(JSON.stringify(data)))
	data = matchOrdersToCells(data, orders, sd, rooms);
	
	console.log('之后',JSON.parse(JSON.stringify(data)))

	return data;
};