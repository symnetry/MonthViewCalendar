// moonview/index.tsx
import React, { useState } from 'react';
import MonthViewCalendar from './MonthViewCalendar';
import OrderModal from './OrderModal';
import OrderDetailModal from './OrderDetailModal';
import dayjs from 'dayjs';
import { CellData, Order, Room } from './types';
import { colorScheme } from './constants'; //配色方案
import { mockRooms, mockOrders } from './mockData'; //模拟数据
import { message } from 'antd';

const Moonview = () => {
  // 示例：自定义日期范围
  const defaultDates: [dayjs.Dayjs, dayjs.Dayjs] = [
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ];
  
  // 状态管理
  const [rooms] = useState<Room[]>(mockRooms);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCells, setSelectedCells] = useState<CellData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
    console.log('日期范围变化:', dates);
  };

  const handleOrderSelect = (order: Order) => {
    console.log('选中订单:', order);
    
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const handleCellSelect = (cell: CellData) => {
    console.log('选中单元格:', cell);
    // 如果单元格未被占用，打开模态框创建订单
    if (cell.type !== 'order') {
      setSelectedCells([cell]);
      setIsModalVisible(true);
    } else {
      message.warning('该单元格已被订单占用');
    }
  };

  const handleMutipleSelect = (cells: CellData[]) => {
    console.log('选中多个单元格:', cells);
    // 检查选中区域是否包含已被占用的单元格
    const hasOccupiedCell = cells.some(cell => cell.type === 'order');
    
    if (hasOccupiedCell) {
      message.warning('选择区域包含已被占用的单元格，请重新选择');
    } else {
      setSelectedCells(cells);
      setIsModalVisible(true);
    }
  };
  
  // 处理订单创建
  const handleOrderCreate = (newOrders: Order[]) => {
    // 添加新订单到订单列表
    setOrders(prevOrders => [...prevOrders, ...newOrders]);
    message.success(`成功创建${newOrders.length}个订单`);
    setIsModalVisible(false);
    setSelectedCells([]);
  };
  
  // 处理模态框取消
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCells([]);
  };

  // 处理详情模态框取消
  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedOrder(null);
  };
  
  // 处理订单更新（拖拽移动订单）
  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    message.success('订单已成功移动');
  };

  return (
    <div >
      <h2 style={{color:"#d4af37"}}>月视图日历</h2>
      <MonthViewCalendar
        rooms={rooms}
        orders={orders}
        colorScheme={colorScheme}
        defaultDates={defaultDates}
        onDateChange={handleDateChange}
        onOrderSelect={handleOrderSelect}
        onCellSelect={handleCellSelect}
        onMutipleSelect={handleMutipleSelect}
        onOrderUpdate={handleOrderUpdate}
      />
      
      {/* 订单创建模态框 */}
      <OrderModal
        visible={isModalVisible}
        selectedCells={selectedCells}
        allRooms={rooms}
        existingOrders={orders}
        onCancel={handleModalCancel}
        onConfirm={handleOrderCreate}
      />
      
      {/* 订单详情模态框 */}
      <OrderDetailModal
        visible={isDetailModalVisible}
        order={selectedOrder}
        onCancel={handleDetailModalCancel}
      />
    </div>
  );
};

export default Moonview;