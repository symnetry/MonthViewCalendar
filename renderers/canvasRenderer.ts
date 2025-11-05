import { CellData, HoverInfo, OrderPosition,ColorScheme } from '../types';
import { canvasConfig } from '../constants';
import { drawRoundedRect } from '../utils/canvasUtils';
import { getPlatformName, getOrderColor } from '../utils/otaUtils';

interface RenderParams {
  canvas: HTMLCanvasElement | null;
  sdata: CellData[][];
  hoverInfo: HoverInfo;
  orderGridMap: Map<string, OrderPosition>;
  isDragging: boolean;
  dragStart: { x: number; y: number; cell?: CellData } | null;
  dragEnd: { x: number; y: number } | null;
  colorScheme:ColorScheme
}

// 渲染到Canvas
export const renderToCanvas = ({
    canvas,
    sdata,
    hoverInfo,
    orderGridMap,
    isDragging,
    dragStart,
    dragEnd,
    colorScheme
}: RenderParams): void => {
    // console.log(canvas)
    if (!canvas || !sdata.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 基础配置
    const { cellWidth, cellHeight, spacing, borderRadius } = canvasConfig;
    const numRows = sdata.length;
    const numCols = sdata[0].length;

    // 设置画布尺寸
    canvas.width = numCols * (cellWidth + spacing) + spacing;
    canvas.height = numRows * (cellHeight + spacing) + spacing;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 清空订单位置映射
    orderGridMap.clear();

    // 第一遍：绘制背景和边框
    sdata.forEach((row, rowIndex) => {
        row.forEach((cell) => {
            if (cell.deleted) return;

            const x = cell.colIndex * (cellWidth + spacing) + spacing;
            const y = rowIndex * (cellHeight + spacing) + spacing;
            const width = cell.colSpan ? (cell.colSpan * (cellWidth + spacing) - spacing) : cellWidth;
            const height = cell.rowSpan ? (cell.rowSpan * (cellHeight + spacing) - spacing) : cellHeight;

            // 判断是否为当前悬停的单元格
            const isCellHover = hoverInfo.cell?.rowIndex === rowIndex && hoverInfo.cell?.colIndex === cell.colIndex;

            // 处理订单跨天背景（仅起始单元格绘制完整背景）
            if (cell.type === 'order' && cell.hasorder && cell.order && cell.isStart) {
                const order = cell.order;
                const startCol = cell.colIndex;
                let endCol = cell.colIndex;

                // 计算订单跨天的结束列
                for (let j = cell.colIndex; j < row.length; j++) {
                    const nextCell = sdata[rowIndex][j];
                    if (nextCell.type === 'order' && nextCell.order?.id === order.id) {
                        endCol = j;
                    } else {
                        break;
                    }
                }

                const totalWidth = (endCol - startCol + 1) * (cellWidth + spacing) - spacing;
                const orderColor = getOrderColor(order.netaboutplatform);
                const isOrderHover = hoverInfo.orderId === order.id;

                // 绘制订单背景
                drawRoundedRect(
                    ctx, 
                    x, y, totalWidth, cellHeight, 
                    borderRadius, 
                    orderColor, 
                    colorScheme.border, 
                    1.5, 
                    isOrderHover
                );

                // 记录订单位置
                orderGridMap.set(order.id, {
                    x, y, width: totalWidth, height: cellHeight, order
                });
            }

            // 绘制非订单单元格背景和边框
            if (cell.type !== 'order') {
                let fillStyle = colorScheme.black;
                const strokeColor = colorScheme.border;

                switch (cell.type) {
                    case 'title':
                        fillStyle = colorScheme.black;
                    break;
                    case 'roomtype':
                        fillStyle = colorScheme.darkGray;
                    break;
                    case 'date':
                        fillStyle = colorScheme.darkGray;
                    break;
                    case 'room':
                        fillStyle = colorScheme.black;
                    break;
                    case 'normalpanel':
                        fillStyle = colorScheme.black;
                    break;
                }

                // 绘制单元格
                drawRoundedRect(
                    ctx, 
                    x, y, width, height, 
                    borderRadius, 
                    fillStyle, 
                    strokeColor, 
                    1.5, 
                    isCellHover
                );
            }
        });
    });

    // 第二遍：绘制文本
    sdata.forEach((row, rowIndex) => {
      row.forEach((cell) => {
        if (cell.deleted) return;

        const x = cell.colIndex * (cellWidth + spacing) + spacing;
        const y = rowIndex * (cellHeight + spacing) + spacing;
        const width = cell.colSpan ? (cell.colSpan * (cellWidth + spacing) - spacing) : cellWidth;
        const height = cell.rowSpan ? (cell.rowSpan * (cellHeight + spacing) - spacing) : cellHeight;

        ctx.font = `${canvasConfig.fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';

        switch (cell.type) {
          case 'title':
            if (cell.title) {
              const totalWidth = cell.colSpan ? (cell.colSpan * (cellWidth + spacing) - spacing) : width;
              const textWidth = ctx.measureText(cell.title).width;
              const textX = x + (totalWidth - textWidth) / 2;
              ctx.fillStyle = colorScheme.gold;
              ctx.fillText(cell.title, textX, y + height / 2);
            }
            break;

          case 'roomtype':
            if (cell.roomtype) {
              const textWidth = ctx.measureText(cell.roomtype).width;
              const textX = x + (width - textWidth) / 2;
              ctx.fillStyle = colorScheme.lightGold;
              ctx.fillText(cell.roomtype, textX, y + height / 2);
            }
            break;

          case 'room':
            if (cell.roomno) {
              const textWidth = ctx.measureText(cell.roomno).width;
              const textX = x + (width - textWidth) / 2;
              ctx.fillStyle = colorScheme.lightGold;
              ctx.fillText(cell.roomno, textX, y + height / 2);
            }
            break;

          case 'date':
            if (cell.dateSmall && cell.week) {
              ctx.textAlign = 'center';
              ctx.fillStyle = colorScheme.gold;
              ctx.fillText(cell.dateSmall, x + width / 2, y + height / 3);
              ctx.fillText(cell.week, x + width / 2, y + height * 2 / 3);
              ctx.textAlign = 'start';
            }
            break;

          case 'order':
            if (cell.hasorder && cell.order) {
              ctx.textAlign = 'center';
              ctx.fillStyle = colorScheme.black;
              
              // 计算订单持续天数
              const stayDays = cell.order.checkout.diff(cell.order.checkin, 'days');
              const isMultiDayOrder = stayDays >= 2;
              
              // 只在起始单元格显示文本
              const displayText = cell.isStart ? (cell.order.ordername || '无名订单') : '';
              
              if (displayText) {
                ctx.fillText(displayText, x + width / 2, y + height / 3);
                ctx.fillText(getPlatformName(cell.order.netaboutplatform), x + width / 2, y + height * 2 / 3);
              }
              
              ctx.textAlign = 'start';
            }
            break;
        }
      });
    });
        //绘制拖拽选择框
        if (isDragging && dragStart && dragEnd) {
            const x = Math.min(dragStart.x, dragEnd.x);
            const y = Math.min(dragStart.y, dragEnd.y);
            const width = Math.abs(dragEnd.x - dragStart.x);
            const height = Math.abs(dragEnd.y - dragStart.y);

            ctx.strokeStyle = colorScheme.gold;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(x, y, width, height);

            // 填充半透明背景
            ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
            // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(x, y, width, height);

            ctx.setLineDash([]); // 重置虚线样式
        }
};