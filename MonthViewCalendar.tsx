import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { generateMonthViewData } from './dataGenerators';
import { renderToCanvas } from './renderers/canvasRenderer';
import { getRelativeMousePos, checkOrderHit, checkCellHit } from './utils/positionUtils';
import { getPlatformName } from './utils/utils';
import { canvasConfig } from './constants'; //配色方案
import { CellData, HoverInfo, OrderPosition,Room,Order } from './types';
const { RangePicker } = DatePicker;

// 定义组件Props
interface MonthViewCalendarProps {
    rooms:Room[],
    orders:Order[],
    colorScheme?: any; // 可选：配色方案
    defaultDates?: [dayjs.Dayjs, dayjs.Dayjs]; // 可选：默认日期范围
    onDateChange?: (dates: [dayjs.Dayjs, dayjs.Dayjs]) => void; // 日期范围变化回调
    onOrderSelect?: (orderId: string) => void; // 订单选中回调
    onCellSelect?: (cell: CellData) => void; // 单元格选中回调
    onMutipleSelect?: (cells: CellData[]) => void; // 多选单元格回调
}

const MonthViewCalendar: React.FC<MonthViewCalendarProps> = ({
    rooms,
    orders,
    colorScheme,
	defaultDates,
	onDateChange,
	onOrderSelect,
	onCellSelect,
	onMutipleSelect
}) => {
  // 状态管理
	const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(
		defaultDates || [dayjs().startOf('month'), dayjs().endOf('month')]
	);
	const [sdata, setSdata] = useState<CellData[][]>([]);
	const [loading, setLoading] = useState(true);
	const [hoverInfo, setHoverInfo] = useState<HoverInfo>({});
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<{ x: number, y: number, cell?: CellData } | null>(null);
	const [dragEnd, setDragEnd] = useState<{ x: number, y: number } | null>(null);
	const [selection, setSelection] = useState<CellData[]>([]);
	const [isDragSelection, setIsDragSelection] = useState(false); // 标记是否为拖拽产生的多单元格选择
  	// DOM引用
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const orderGridMap = useRef<Map<string, OrderPosition>>(new Map());

  // 初始化/日期变化时加载数据
  useEffect(() => {
    // console.log(123123)
    const loadData = async () => {
      setLoading(true);
      try {
        // console.log(rooms,orders)
        const data = await generateMonthViewData(selectedDates,rooms,orders);
        // console.log(data)
        setSdata(data);
      } catch (err) {
        console.error('加载日历数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDates,rooms,orders]);

  // 数据或配置变化时重绘Canvas
  useEffect(() => {
    if (sdata.length && canvasRef.current) {
        // console.log('canvasRef.current',canvasRef.current)
      renderToCanvas({
        canvas:canvasRef.current,
        sdata,
        hoverInfo,
        orderGridMap:orderGridMap.current,
        isDragging,
        dragStart,
        dragEnd,
        colorScheme
      });
    }
  }, [sdata, hoverInfo, isDragging, dragStart, dragEnd,colorScheme]);

  // 处理日期范围选择变化
  const handleRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    if (dates[0] && dates[1]) {
      const newDates: [dayjs.Dayjs, dayjs.Dayjs] = [dates[0], dates[1]];
      setSelectedDates(newDates);
      onDateChange?.(newDates);
    }
  };

    // 处理鼠标移动（检测悬停的单元格和订单）
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    	// console.log('handleCanvasMouseMove')
      const canvas = canvasRef.current;
      if (!canvas || !sdata.length) return;


      const { x: mouseX, y: mouseY } = getRelativeMousePos(e, canvas);
      const { cellWidth, cellHeight, spacing } = canvasConfig;

      // 重置悬停信息
      let newHoverInfo: HoverInfo = {};

      // 1. 检测是否悬停在订单上
      const { hitOrderId } = checkOrderHit(mouseX, mouseY, orderGridMap.current);
      if (hitOrderId) {
        newHoverInfo.orderId = hitOrderId;
      }

      // 2. 检测是否悬停在单元格上（非订单区域）
      if (!newHoverInfo.orderId) {
        const { cell } = checkCellHit(mouseX, mouseY, sdata, cellWidth, cellHeight, spacing);
        if (cell) {
          newHoverInfo.cell = cell;
        }
      }

      // 更新悬停信息并重新渲染
      if (
        newHoverInfo.cell?.rowIndex !== hoverInfo.cell?.rowIndex ||
        newHoverInfo.cell?.colIndex !== hoverInfo.cell?.colIndex ||
        newHoverInfo.orderId !== hoverInfo.orderId
      ) {
      	// console.log('更新悬停信息并重新渲染')
        setHoverInfo(newHoverInfo);
        // renderToCanvas(canvasRef.current, sdata, newHoverInfo, orderGridMap.current);
        renderToCanvas({
          canvas:canvasRef.current,
          sdata,
          hoverInfo:newHoverInfo,
          orderGridMap:orderGridMap.current,
          isDragging: false,
          dragStart: null,
          dragEnd: null,
          colorScheme
        });
      }

      // 显示订单详情tooltip
      if (tooltipRef.current && newHoverInfo.orderId) {
        const orderPos = orderGridMap.current.get(newHoverInfo.orderId);
        if (orderPos) {
          tooltipRef.current.style.left = `${e.clientX + 10}px`;
          tooltipRef.current.style.top = `${e.clientY + 10}px`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.innerHTML = `
            <div style="color: ${colorScheme.gold}; font-weight: bold;">${orderPos.order.ordername}</div>
            <div>平台：${getPlatformName(orderPos.order.netaboutplatform)}</div>
            <div>入住：${orderPos.order.checkin.format('YYYY-MM-DD')}</div>
            <div>退房：${orderPos.order.checkout.format('YYYY-MM-DD')}</div>
          `;
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    }, [hoverInfo, sdata]);


  // 处理画布点击事件
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
  // 核心：如果是拖拽产生的多单元格选择，直接拦截点击事件
    if (isDragSelection) {
      setIsDragSelection(false); // 重置标记
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas || !sdata.length) return;
    
    const { x: mouseX, y: mouseY } = getRelativeMousePos(e, canvas);
    const { cellWidth, cellHeight, spacing } = canvasConfig;

    // 检查是否点击了订单
    const { hitOrder } = checkOrderHit(mouseX, mouseY, orderGridMap.current);
    if (hitOrder) {
      // console.log('点击了订单:', hitOrder);
      onOrderSelect?.(hitOrder); // 触发订单选中回调
      return;
    }

    // 检查是否点击了normalpanel单元格
    const { cell } = checkCellHit(
      mouseX, 
      mouseY, 
      sdata, 
      cellWidth, 
      cellHeight, 
      spacing, 
      'normalpanel'
    );
    
    if (cell) {
      // console.log('点击了普通单元格，单元格:', cell);
      onCellSelect?.(cell); // 触发单元格选中回调
      // if([0, 1].includes(selection.length))onCellSelect?.(cell); // 触发单元格选中回调

      return;
    }
  }, [sdata, onOrderSelect, onCellSelect,selection,isDragSelection]);

	// 开始拖拽
	const handleDragStart = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || !sdata.length) return;

		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const { cellWidth, cellHeight, spacing } = canvasConfig;

		// 检查是否从normalpanel单元格开始拖拽
		let startCell: CellData | null = null;
		for (let i = 0; i < sdata.length; i++) {
			const row = sdata[i];
			for (let j = 0; j < row.length; j++) {
				const cell = row[j];
				if (cell.deleted || cell.type !== 'normalpanel') continue;

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
					startCell = cell;
					break;
				}
			}
			if (startCell) break;
		}

		if (startCell) {
			setIsDragging(true);
			setDragStart({ x: mouseX, y: mouseY, cell: startCell });
			setDragEnd(null);
			setSelection([startCell]);
		}
	}, [sdata]);

  	// 拖拽过程
	  const handleDragging = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
	    if (!isDragging || !dragStart) return;
	    
	    const canvas = canvasRef.current;
	    if (!canvas || !sdata.length) return;
	    
	    const rect = canvas.getBoundingClientRect();
	    const mouseX = e.clientX - rect.left;
	    const mouseY = e.clientY - rect.top;
	    const { cellWidth, cellHeight, spacing } = canvasConfig;

	    setDragEnd({ x: mouseX, y: mouseY });

	    // 计算当前选中的单元格
	    const minX = Math.min(dragStart.x, mouseX);
	    const maxX = Math.max(dragStart.x, mouseX);
	    const minY = Math.min(dragStart.y, mouseY);
	    const maxY = Math.max(dragStart.y, mouseY);

	    const selectedCells: CellData[] = [];
	    
	    sdata.forEach((row, rowIndex) => {
	      row.forEach((cell) => {
	        if (cell.deleted || cell.type !== 'normalpanel') return;
	        
	        const x = cell.colIndex * (cellWidth + spacing) + spacing;
	        const y = rowIndex * (cellHeight + spacing) + spacing;
	        const width = cell.colSpan ? (cell.colSpan * (cellWidth + spacing) - spacing) : cellWidth;
	        const height = cell.rowSpan ? (cell.rowSpan * (cellHeight + spacing) - spacing) : cellHeight;

	        // 检查单元格是否与选择区域重叠
	        if (
	          x < maxX &&
	          x + width > minX &&
	          y < maxY &&
	          y + height > minY
	        ) {
	          selectedCells.push(cell);
	        }
	      });
	    });

	    setSelection(selectedCells);
	  }, [isDragging, dragStart, sdata]);

	const handleDragEnd = useCallback(() => {
		if (!isDragging || !dragStart || !dragEnd) {
			setIsDragging(false);
			setDragStart(null);
			setDragEnd(null);
			setSelection([]);
			return;
		}

		// 计算拖拽移动的距离（使用勾股定理简化为曼哈顿距离或欧氏距离）
		const dx = Math.abs(dragEnd.x - dragStart.x);
		const dy = Math.abs(dragEnd.y - dragStart.y);
		const distance = Math.sqrt(dx * dx + dy * dy); // 欧氏距离
		// 或使用更简单的曼哈顿距离：const distance = dx + dy;
		let isEffectiveDrag 

		console.log(distance)

		// 判断是否超过拖拽阈值
		if (distance < canvasConfig.dragThreshold) {
			// 移动距离过小，视为点击而非拖拽，仅重置状态
			setIsDragging(false);
			setDragStart(null);
			setDragEnd(null);
			setSelection([]);
			console.log('没有超过阈值')
			return; // 不执行后续拖拽逻辑
		}else{
			isEffectiveDrag = true
		}

		// 检查选择区域是否包含订单
		const hasOrderInSelection = checkIfSelectionContainsOrder(selection);

		if (hasOrderInSelection) {
		console.log('选择包含订单，无效');
		} else if(isEffectiveDrag){
		
		// 创建跨日期订单的逻辑
			if (selection.length > 1) {
				// console.log('有效选择区域:', selection);
				setIsDragSelection(true); // 多单元格拖拽选择，标记为true
				onMutipleSelect?.(selection)
			}
		}

		// 重置拖拽状态
		setIsDragging(false);
		setDragStart(null);
		setDragEnd(null);
		// setSelection([]);
	}, [isDragging, dragStart, dragEnd, selection]);

  // 检查选择区域是否包含订单
  const checkIfSelectionContainsOrder = useCallback((selectedCells: CellData[]) => {
    if (!selectedCells.length) return false;
    
    const { cellWidth, cellHeight, spacing } = canvasConfig;
    
    // 计算选择区域的边界
    const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
    const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
    const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
    const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));

    // 检查订单是否与选择区域重叠
    let hasOverlap = false;
    orderGridMap.current.forEach((pos) => {
      const orderRow = Math.floor(pos.y / (cellHeight + spacing));
      const orderCol = Math.floor(pos.x / (cellWidth + spacing));
      
      if (
        orderRow >= minRow &&
        orderRow <= maxRow &&
        orderCol >= minCol &&
        orderCol <= maxCol
      ) {
        hasOverlap = true;
      }
    });
    
    return hasOverlap;
  }, []); // 修复依赖项错误

  return (
    <div style={{ position: 'relative', border: '1px solid #ccc', borderRadius: 4,overflowX:"scroll" }}>
      {/* 左上角的RangePicker组件 */}
      <div style={{ padding: '8px 16px'}}>
        <RangePicker
          value={[selectedDates[0], selectedDates[1]]}
          onChange={handleRangeChange}
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
        />
      </div>

      {/* 日历Canvas区域 */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
      ) : (
        <canvas
          ref={canvasRef}
          onMouseMove={(e) => isDragging?handleDragging(e):handleCanvasMouseMove(e)}
          
          onClick={handleCanvasClick}
          onMouseDown={handleDragStart}

          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          style={{ display: 'block' }}
        />
      )}

      {/* 订单详情Tooltip */}
      <div
        ref={tooltipRef}
        style={{
        	fontSize: 12,
          position: 'fixed',
          background: 'rgba(0,0,0,0.8)',

          color: colorScheme.lightGold,
          padding: '8px 12px',
          borderRadius: 4,
          pointerEvents: 'none',
          display: 'none',
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default MonthViewCalendar;