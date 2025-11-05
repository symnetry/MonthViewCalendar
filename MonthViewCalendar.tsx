import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { generateMonthViewData } from './dataGenerators';
import { renderToCanvas } from './renderers/canvasRenderer';
import { getRelativeMousePos, checkOrderHit, checkCellHit, checkOrderConflict } from './utils/positionUtils';
import { getPlatformName,throttle } from './utils/utils';
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
    onOrderUpdate?: (updatedOrder: Order) => void; // 订单更新回调
}

const MonthViewCalendar: React.FC<MonthViewCalendarProps> = ({
    rooms,
    orders,
    colorScheme,
	defaultDates,
	onDateChange,
	onOrderSelect,
	onCellSelect,
	onMutipleSelect,
	onOrderUpdate
}) => {
  // 状态管理
	const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(
		defaultDates || [dayjs().startOf('month'), dayjs().endOf('month')]
	);
	const [sdata, setSdata] = useState<CellData[][]>([]);
	const [loading, setLoading] = useState(true);
	const [hoverInfo, setHoverInfo] = useState<HoverInfo>({});
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<{ x: number, y: number, cell?: CellData, order?: Order } | null>(null);
	const [dragEnd, setDragEnd] = useState<{ x: number, y: number } | null>(null);
	const [selection, setSelection] = useState<CellData[]>([]);
	const [isDragSelection, setIsDragSelection] = useState(false); // 标记是否为拖拽产生的多单元格选择
	const [draggingOrder, setDraggingOrder] = useState<Order | null>(null); // 当前正在拖拽的订单
	const [hasDragConflict, setHasDragConflict] = useState(false); // 标记拖拽是否有冲突，用于阻止点击事件
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
        // console.log('draggingOrder',draggingOrder)
      renderToCanvas({
        canvas:canvasRef.current,
        sdata,
        hoverInfo,
        orderGridMap:orderGridMap.current,
        isDragging,
        dragStart,
        dragEnd,
        draggingOrder,
        colorScheme
      });
    }
  }, [sdata, hoverInfo, isDragging, dragStart, dragEnd, draggingOrder, colorScheme]);

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
    // 核心1：如果有拖拽冲突，直接拦截点击事件并重置冲突标记
    if (hasDragConflict) {
      setHasDragConflict(false); // 重置冲突标记
      return;
    }
    
    // 核心2：如果是拖拽产生的多单元格选择，直接拦截点击事件
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
      return;
    }
  }, [sdata, onOrderSelect, onCellSelect,selection,isDragSelection, hasDragConflict]);

	// 开始拖拽
	const handleDragStart = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || !sdata.length) return;

		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const { cellWidth, cellHeight, spacing } = canvasConfig;

		// 1. 检查是否点击了订单
		const { hitOrder } = checkOrderHit(mouseX, mouseY, orderGridMap.current);
		if (hitOrder) {
			// 开始拖拽订单
			setIsDragging(true);
			setDraggingOrder(hitOrder);
			setDragStart({ x: mouseX, y: mouseY, order: hitOrder });
			setDragEnd(null);
			return;
		}

		// 2. 检查是否从normalpanel单元格开始拖拽
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

  	// 拖拽过程的实际处理函数
	const handleDraggingProcess = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging || !dragStart) return;
		
		const canvas = canvasRef.current;
		if (!canvas || !sdata.length) return;
		
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const { cellWidth, cellHeight, spacing } = canvasConfig;
		
		// 定义吸附阈值
		const snapThreshold = 20; // 像素

		// 判断是订单拖拽还是单元格选择拖拽
		if (dragStart.order && draggingOrder) {
			// 订单拖拽的边缘吸附逻辑
			let snappedX = mouseX;
			let snappedY = mouseY;
			
			// 查找最近的单元格
			const { cell, rowIndex } = checkCellHit(mouseX, mouseY, sdata, cellWidth, cellHeight, spacing, 'normalpanel');
			
			if (cell && rowIndex !== -1) {
				// 计算当前单元格的左上角坐标
				const targetX = cell.colIndex * (cellWidth + spacing) + spacing;
				const targetY = rowIndex * (cellHeight + spacing) + spacing;
				
				// 计算鼠标相对于起始点的偏移
				const deltaX = mouseX - dragStart.x;
				const deltaY = mouseY - dragStart.y;
				
				// 如果距离单元格边缘足够近，则吸附
				const currentDragPosX = dragStart.x + deltaX;
				const currentDragPosY = dragStart.y + deltaY;
				const distanceToX = Math.abs(currentDragPosX - targetX);
				const distanceToY = Math.abs(currentDragPosY - targetY);
				
				if (distanceToX < snapThreshold) {
					snappedX = targetX;
				}
				if (distanceToY < snapThreshold) {
					snappedY = targetY;
				}
			}
			
			setDragEnd({ x: snappedX, y: snappedY });
			
			// 实时渲染拖拽中的订单
			renderToCanvas({
				canvas: canvasRef.current,
				sdata,
				hoverInfo,
				orderGridMap: orderGridMap.current,
				isDragging: true,
				dragStart,
				dragEnd: { x: snappedX, y: snappedY },
				draggingOrder,
				colorScheme
			});
			return;
		}
		
		setDragEnd({ x: mouseX, y: mouseY });

		// 单元格选择拖拽逻辑
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
	};
	
	// 创建节流版本的拖拽处理函数
	const handleDragging = useCallback(
		throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
			handleDraggingProcess(e);
		}, 48), // 50毫秒的节流延迟，可根据需要调整
		[isDragging, dragStart, sdata, draggingOrder, hoverInfo, colorScheme]
	);

	// 处理订单拖拽结束
  const handleOrderDragEnd = () => {
    // 如果没有正在拖拽的订单或必要参数，直接返回
    if (!dragStart?.order || !draggingOrder || !dragEnd) {
      setHasDragConflict(true);
      return false;
    }
    // console.log('asdadad拖拽结束')
    
    const canvas = canvasRef.current;
    if (!canvas || !sdata.length) {
      setHasDragConflict(true);
      return false;
    }
    
    const { cellWidth, cellHeight, spacing } = canvasConfig;
    
    // 获取拖拽结束位置所在的单元格
    const { cell, rowIndex } = checkCellHit(dragEnd.x, dragEnd.y, sdata, cellWidth, cellHeight, spacing, 'normalpanel');
    
    // 检查单元格是否有效
    if (!cell || rowIndex === -1) {
      setHasDragConflict(true);
      return false;
    }
    console.log('目标单元格',cell)
    // 计算拖拽距离
    const dx = Math.abs(dragEnd.x - dragStart.x);
    const dy = Math.abs(dragEnd.y - dragStart.y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果拖拽距离过小，视为未拖拽
    if (distance < canvasConfig.dragThreshold) {
      // setHasDragConflict(true);
      return false;
    }
    
    // 核心1：检查目标单元格是否已有订单或被标记为有订单（order或hasorder属性）
    // 即使单元格只有部分日期与其他订单冲突，也不允许放置
    // console.log('单元格',cell)
    // if (cell.order || cell.hasorder || (cell as any).isOccupied) {
    //   console.log('订单拖拽冲突：目标单元格已有订单或被占用');
    //   setHasDragConflict(true); // 标记有冲突，用于阻止后续点击事件
    //   return false;
    // }
    
    // 计算订单持续天数（包括入住和退房日期，确保天数计算准确）
    const stayDays = draggingOrder.checkout.diff(draggingOrder.checkin, 'days');
    
    // 获取目标单元格对应的日期
    const targetDate = dayjs(cell.fullDate);
    
    // 计算新的入住和退房日期，确保退房日期计算正确
    const newCheckin = targetDate;
    const newCheckout = targetDate.add(stayDays, 'day');
    
    // 获取目标房间（通过rowIndex确定）
    const targetRoomIndex = rowIndex - 1; // 假设第一行是表头
    if (targetRoomIndex < 0 || targetRoomIndex >= rooms.length) {
      setHasDragConflict(true);
      return false;
    }
    
    const targetRoomId = rooms[targetRoomIndex].id;
    
    // 特别检查：如果目标房间与原房间不同，需要检查目标房间的所有订单
    // 即使目标房间与原房间相同，也需要排除自身订单检查其他订单
    // 自己和自己不冲突（已通过filter排除）
    const ordersToCheck = orders.filter(o => o.id !== draggingOrder.id);
    
    // 检查是否与其他订单冲突，使用更严格的冲突检测
    const conflictingOrders = checkOrderConflict(
      [targetRoomId],
      [newCheckin, newCheckout],
      ordersToCheck
    );
    
    // 核心2：冲突检测 - 如果检测到冲突，完全不执行任何操作，标记冲突状态，直接返回false
    if (conflictingOrders.length > 0) {
      console.log('订单拖拽冲突：新订单日期范围与房间', targetRoomId, '的现有订单有重叠');
      console.log('冲突订单：', conflictingOrders.map(o => `${o.ordername || '订单'}(${o.checkin.format('YYYY-MM-DD')}至${o.checkout.format('YYYY-MM-DD')})`));
      setHasDragConflict(true); // 标记有冲突，用于阻止后续点击事件
      return false;
    }
    
    // 无冲突时，创建更新后的订单对象
    const updatedOrder: Order = {
      ...draggingOrder,
      roomId: targetRoomId,
      checkin: newCheckin,
      checkout: newCheckout
    };
    
    // 输出成功日志
    console.log('订单拖拽成功：从房间', draggingOrder.roomId, '移动到', targetRoomId);
    console.log('新的日期范围：', newCheckin.format('YYYY-MM-DD'), '至', newCheckout.format('YYYY-MM-DD'));
    
    // 触发订单更新回调（如果存在）
    if (onOrderUpdate) {
      onOrderUpdate(updatedOrder);
    }
    
    // 重置冲突标记（如果之前被设置过）
    setHasDragConflict(false);
    
    return true;
  };

  const handleDragEnd = useCallback(() => {
		if (!isDragging || !dragStart || !dragEnd) {
			setIsDragging(false);
			setDragStart(null);
			setDragEnd(null);
			setSelection([]);
			setDraggingOrder(null);
			return;
		}

		// 判断是订单拖拽还是单元格选择拖拽
		if (dragStart.order && draggingOrder) {
			// 处理订单拖拽结束
      // console.log('asdadad拖拽')
			const success = handleOrderDragEnd();
			// 如果success返回值为undefined，视为false
			// const isSuccessful = success === true;
			
			// 重置订单拖拽状态
			setIsDragging(false);
			setDragStart(null);
			setDragEnd(null);
			setDraggingOrder(null);
			return;
		}

		// 计算拖拽移动的距离
		const dx = Math.abs(dragEnd.x - dragStart.x);
		const dy = Math.abs(dragEnd.y - dragStart.y);
		const distance = Math.sqrt(dx * dx + dy * dy);
		let isEffectiveDrag 

		// 判断是否超过拖拽阈值
		if (distance < canvasConfig.dragThreshold) {
			// 移动距离过小，视为点击而非拖拽，仅重置状态
			setIsDragging(false);
			setDragStart(null);
			setDragEnd(null);
			setSelection([]);
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
				setIsDragSelection(true); // 多单元格拖拽选择，标记为true
				onMutipleSelect?.(selection)
			}
		}

		// 重置拖拽状态
		setIsDragging(false);
		setDragStart(null);
		setDragEnd(null);
		// setSelection([]);
	}, [isDragging, dragStart, dragEnd, selection, draggingOrder]);

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