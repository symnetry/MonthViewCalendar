import dayjs from 'dayjs';

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
	checkin: dayjs.Dayjs;
	checkout: dayjs.Dayjs;
	netaboutplatform: number;
	ordername?: string;
	idNumber?: string; // 身份证号码
}

// 单元格数据类型
// export interface CellData {
// 	rowIndex: number;
// 	colIndex: number;
// 	type: 'title' | 'roomtype' | 'room' | 'date' | 'order' | 'normalpanel';
// 	title?: string;
// 	roomtype?: string;
// 	roomno?: string;
// 	dateSmall?: string;
// 	week?: string;
// 	fullDate?: string;
// 	hasorder?: boolean;
// 	order?: Order;
// 	colSpan?: number;
// 	rowSpan?: number;
// 	deleted?: boolean;
// 	isStart?: boolean;
// 	isEnd?: boolean;
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
		checkin: dayjs.Dayjs;
		checkout: dayjs.Dayjs;
		netaboutplatform: number;
		ordername?: string;
		idNumber?: string; // 身份证号码
	};
	colSpan?: number;
	rowSpan?: number;
	deleted?: boolean;
	isStart?: boolean;
	isEnd?: boolean;
	orderRef?: string; // 订单引用ID，用于跨天订单渲染检测
	linkedOrderId?: string; // 链接到的订单ID，用于关联订单相关单元格
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
	defaultDates?: [dayjs.Dayjs, dayjs.Dayjs];
	onDateChange?: (dates: [dayjs.Dayjs, dayjs.Dayjs]) => void;
	onOrderSelect?: (orderId: string) => void;
	onCellSelect?: (cell: CellData) => void;
}