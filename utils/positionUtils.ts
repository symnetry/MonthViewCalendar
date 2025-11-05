import { CellData, OrderPosition,Order } from '../types';
import dayjs from 'dayjs';

    // 提取公共函数：获取鼠标在画布上的相对位置
  export const getRelativeMousePos = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // 提取公共函数：检测鼠标是否命中订单
  export const checkOrderHit = (mouseX: number, mouseY: number, orderGridMap: Map<string, OrderPosition>) => {
      let hitOrder: Order | null = null;
      let hitOrderId: string | undefined;
      
      orderGridMap.forEach((pos, orderId) => {
        if (
          mouseX >= pos.x && 
          mouseX <= pos.x + pos.width && 
          mouseY >= pos.y && 
          mouseY <= pos.y + pos.height
        ) {
          hitOrder = pos.order;
          hitOrderId = orderId;
        }
      });
      
      return { hitOrder, hitOrderId };
    };

    // 提取公共函数：检测鼠标是否命中单元格
  export const checkCellHit = (mouseX: number, mouseY: number, sdata: CellData[][], cellWidth: number, cellHeight: number, spacing: number,cellType?: string /*可选：指定单元格类型*/ ) => {
      for (let i = 0; i < sdata.length; i++) {
        const row = sdata[i];
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          
          // 如果指定了类型，只检测该类型的单元格
          if (cellType && cell.type !== cellType) continue;
          if (cell.deleted) continue;
          
          const x = cell.colIndex * (cellWidth + spacing) + spacing;
          const y = i * (cellHeight + spacing) + spacing;
          const width = cell.colSpan ? (cell.colSpan * (cellWidth + spacing) - spacing) : cellWidth;
          const height = cell.rowSpan ? (cell.rowSpan * (cellHeight + spacing) - spacing) : cellHeight;

          if (
            mouseX >= x && 
            mouseX <= x + width && 
            mouseY >= y && 
            mouseY <= y + height
          ) {
            return { cell, rowIndex: i };
          }
        }
      }
      return { cell: null, rowIndex: -1 };
    };

    // 提取公共函数：检测订单冲突
  export const checkOrderConflict = (roomIds: string[], dateRange: [dayjs.Dayjs, dayjs.Dayjs], existingOrders: Order[]) => {
      const [startDate, endDate] = dateRange;
      const conflictingOrders: Order[] = [];
      console.log()
      existingOrders.forEach(order => {
        // 检查房间是否冲突
        if (roomIds.includes(order.roomId)) {
          // 检查日期范围是否重叠
          // 重叠条件：新订单的开始日期 < 现有订单的结束日期 并且 新订单的结束日期 > 现有订单的开始日期
          if (startDate.isBefore(order.checkout) && endDate.isAfter(order.checkin)) {
            conflictingOrders.push(order);
          }
        }
      });
      
      return conflictingOrders;
    };