# <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">月视图日历组件（MonthViewCalendar）项目介绍与使用指南</font>
## <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">项目概述</font>
<font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">本项目是一个基于 React 和 Canvas 的月视图日历组件，主要用于酒店、民宿等场景的房间预订状态可视化管理。通过该组件，可直观展示指定日期范围内的房间类型、房间号及对应订单信息，并支持日期切换、订单选中、单元格拖拽选择等交互操作，适合高效管理房间预订情况。</font>

## <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">核心功能</font>
1. **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">月视图展示</font>**
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">以网格形式展示房型（合并相同房型）、房间号、日期（含星期）及订单信息</font>
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">跨日期订单自动连续显示，并标注订单所属平台及客户信息</font>
2. **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">交互功能</font>**
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">日期范围选择：通过日期选择器切换查看不同时间段的预订情况</font>
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">订单交互：点击订单触发选中回调，悬停显示订单详情（客户、平台、入住 / 退房时间）</font>
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">单元格交互：点击空白单元格触发选中回调，支持拖拽选择多个连续单元格（用于新增预订等场景）</font>
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">视觉反馈：悬停时高亮显示订单或单元格，拖拽时有虚线选择框提示</font>
3. **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">数据处理</font>**
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">自动处理房型合并、跨日期订单渲染等逻辑</font>
    - <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">支持自定义配色方案，适配不同 UI 风格</font>

## <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">技术栈</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">框架：React + TypeScript</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">日期处理：Moment.js</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">渲染引擎：Canvas（高效处理大量单元格渲染）</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">UI 组件：Ant Design（日期选择器）</font>

## <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">MonthViewCalendar 组件使用指南</font>
### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">1. 组件 Props 说明</font>
| **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">属性名</font>** | **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">类型</font>** | **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">说明</font>** | **<font style="color:rgb(0, 0, 0) !important;background-color:rgb(249, 250, 251);">是否必传</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">rooms</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">Room[]</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">房间数据数组（包含房间 ID、编号、类型等信息）</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">是</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">orders</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">Order[]</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">订单数据数组（包含订单 ID、房间 ID、入住 / 退房时间等信息）</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">是</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">colorScheme</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">ColorScheme</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">配色方案（自定义组件颜色）</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">是</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">defaultDates</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">[Moment, Moment]</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">默认显示的日期范围（默认为当月）</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">是</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">onDateChange</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">(dates: [Moment, Moment]) => void</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">日期范围变化时的回调函数</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">否</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">onOrderSelect</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">(order: Order) => void</font>` | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">订单被选中时的回调函数</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">否</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">onCellSelect</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">(cell: CellData) => void</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">单个单元格被选中时的回调函数</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">否</font> |
| <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">onMutipleSelect</font> | <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">(cells: CellData[]) => void</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">拖拽选择多个单元格时的回调函数</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgb(249, 250, 251);">否</font> |


### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">2. 数据类型定义</font>
<font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">使用组件前需遵循以下数据结构：</font>

**<font style="color:rgba(0, 0, 0, 0.85);background-color:rgb(249, 250, 251);">typescript</font>**

```typescript
// 房间类型（Room）
interface Room {
  id: string; // 房间唯一标识
  roomno: string; // 房间号（如"101"）
  roomtype: string; // 房型（如"标准间"）
  sort: number; // 排序序号
}

// 订单类型（Order）
interface Order {
  id: string; // 订单唯一标识
  roomId: string; // 关联的房间ID（与Room.id对应）
  checkin: Moment; // 入住时间（Moment对象）
  checkout: Moment; // 退房时间（Moment对象）
  netaboutplatform: number; // 预订平台（1:携程，2:美团，3:飞猪）
  ordername?: string; // 客户名称（可选）
}

// 配色方案（ColorScheme）
interface ColorScheme {
  black: string;
  gold: string;
  darkGray: string;
  lightGold: string;
  border: string;
  borderHighlight: string;
  order: {
    ctrip: string;
    meituan: string;
    fliggy: string;
  };
}
```

### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">3. 使用步骤</font>
#### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">步骤 1：安装依赖</font>
<font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">确保项目中已安装以下依赖：</font>

**<font style="color:rgba(0, 0, 0, 0.85);background-color:rgb(249, 250, 251);">bash</font>**

```bash
npm install react react-dom moment antd @types/react @types/moment
```

#### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">步骤 2：导入组件</font>
**<font style="color:rgba(0, 0, 0, 0.85);background-color:rgb(249, 250, 251);">typescript</font>**

```typescript
import React from 'react';
import MonthViewCalendar from './moonview/MonthViewCalendar';
import moment from 'moment';
import { colorScheme } from './moonview/constants';
```

#### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">步骤 3：准备数据</font>
**<font style="color:rgba(0, 0, 0, 0.85);background-color:rgb(249, 250, 251);">typescript</font>**

```typescript
// 示例房间数据
const mockRooms = [
  { id: '1', roomno: '101', roomtype: '标准间', sort: 1 },
  { id: '2', roomno: '102', roomtype: '标准间', sort: 2 },
  { id: '3', roomno: '201', roomtype: '大床房', sort: 3 },
];

// 示例订单数据
const mockOrders = [
  {
    id: 'order1',
    roomId: '1',
    checkin: moment().add(1, 'day'), // 明天入住
    checkout: moment().add(3, 'day'), // 3天后退房
    netaboutplatform: 1, // 携程
    ordername: '张三'
  },
];
```

#### <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">步骤 4：使用组件</font>
**<font style="color:rgba(0, 0, 0, 0.85);background-color:rgb(249, 250, 251);">typescript</font>**

```typescript
const App = () => {
  // 处理日期范围变化
  const handleDateChange = (dates: [moment.Moment, moment.Moment]) => {
    console.log('日期范围切换为:', dates.map(d => d.format('YYYY-MM-DD')));
  };

  // 处理订单选中
  const handleOrderSelect = (order: Order) => {
    console.log('选中订单:', order);
  };

  // 处理单元格选中
  const handleCellSelect = (cell: CellData) => {
    console.log('选中单元格:', cell);
  };

  // 处理多单元格选择
  const handleMutipleSelect = (cells: CellData[]) => {
    console.log('选中多个单元格:', cells);
  };

  return (
    <div>
      <h2>房间预订月视图</h2>
      <MonthViewCalendar
        rooms={mockRooms}
        orders={mockOrders}
        colorScheme={colorScheme}
        defaultDates={[moment().startOf('month'), moment().endOf('month')]} // 默认显示当月
        onDateChange={handleDateChange}
        onOrderSelect={handleOrderSelect}
        onCellSelect={handleCellSelect}
        onMutipleSelect={handleMutipleSelect}
      />
    </div>
  );
};

export default App;
```

## <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">注意事项</font>
1. <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">订单的</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">checkin</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">和</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">checkout</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">需为 Moment 对象，确保日期计算准确</font>
2. <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">拖拽选择单元格时，若选择区域包含已有订单，会被判定为无效选择</font>
3. <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">如需自定义样式，可通过</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">colorScheme</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">属性修改配色方案</font>
4. <font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">组件基于 Canvas 渲染，适合大数据量场景，若需进一步优化性能，可调整</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">canvasConfig</font><font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">中的单元格尺寸参数</font>

<font style="color:rgb(0, 0, 0);background-color:rgb(249, 250, 251);">通过以上步骤，即可快速集成月视图日历组件，实现房间预订状态的可视化管理。</font>

