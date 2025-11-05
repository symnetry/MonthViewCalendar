// moonview/index.tsx
import React from 'react';
import MonthViewCalendar from './MonthViewCalendar';
import moment, { Moment } from 'moment';
import { CellData,Order } from './types';
import { colorScheme } from './constants'; //配色方案
import { mockRooms, mockOrders } from './mockData'; //模拟数据

const Moonview = () => {
  // 示例：自定义日期范围
  const defaultDates: [Moment, Moment] = [
    moment().startOf('month'),
    moment().endOf('month')
  ];

  const handleDateChange = (dates: [Moment, Moment]) => {
    console.log('日期范围变化:', dates);
  };

  const handleOrderSelect = (order: Order) => {
    console.log('选中订单:', order);
  };

  const handleCellSelect = (cell: CellData) => {
    console.log('选中单元格:', cell);
  };

  const handleMutipleSelect = (cell: CellData) => {
    console.log('选中多个单元格:', cell);
  };

  return (
    <div >
      <h2 style={{color:"#d4af37"}}>月视图日历</h2>
      <MonthViewCalendar
        rooms={mockRooms}
        orders={mockOrders}
        colorScheme={colorScheme}
        defaultDates={defaultDates}
        onDateChange={handleDateChange}
        onOrderSelect={handleOrderSelect}
        onCellSelect={handleCellSelect}
        onMutipleSelect={handleMutipleSelect}
      />
    </div>
  );
};

export default Moonview;