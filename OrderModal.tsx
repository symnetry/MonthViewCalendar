import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { CellData, Order, Room } from './types';
import dayjs from 'dayjs';
import { checkOrderConflict } from './utils/orderUtils';

// console.dir(moment)
const { Option } = Select;
const { RangePicker } = DatePicker;

// 订单表单数据类型
interface OrderFormData {
  name: string;
  phone: string;
  roomIds: string[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  price: number;
  platform: number;
  notes?: string;
  ordername?: string;
}

// 模态框Props接口
interface OrderModalProps {
  visible: boolean;
  selectedCells: CellData[];
  allRooms: Room[];
  existingOrders: Order[];
  onCancel: () => void;
  onConfirm: (newOrders: Order[]) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  selectedCells,
  allRooms,
  existingOrders,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm<OrderFormData>();
  const [loading, setLoading] = useState(false);
  
  // 从选中单元格中提取房间和日期信息
  useEffect(() => {
    if (visible && selectedCells.length > 0) {
      // 提取选中的房间IDs（通过rowIndex确定）
      console.log('所有房间:', allRooms);
      console.log('选中的单元格:', selectedCells);
      
      // 通过rowIndex确定房间，假设rowIndex与房间数组索引对应
      // 排除第0行（可能是表头）
      const roomIndices = [...new Set(selectedCells
        .filter(cell => typeof cell.rowIndex === 'number' && cell.rowIndex > 0)
        .map(cell => cell.rowIndex - 1))]; // 减去1得到房间数组的索引
      
      console.log('房间索引:', roomIndices);
      const selectedRoomIds = roomIndices
        .filter(index => index >= 0 && index < allRooms.length)
        .map(index => allRooms[index].id);
      
      console.log('选中的房间IDs:', selectedRoomIds);
      
      // 提取选中的日期范围
      const dates = selectedCells
        .filter(cell => cell.fullDate)
        .map(cell => dayjs(cell.fullDate));

        console.log('选中的日期范围:', dates);
      
      const minDate = dates.length > 0 ? dates.reduce((min, current) => current.isBefore(min) ? current : min) : dayjs();
      const maxDate = dates.length > 0 ? dates.reduce((max, current) => current.isAfter(max) ? current : max).add(1, 'day') : dayjs().add(1, 'day');
      
      // 设置表单初始值
      form.setFieldsValue({
        roomIds: selectedRoomIds,
        dateRange: [minDate, maxDate],
        price: 0,
        platform: 1,
      });
    }
  }, [visible, selectedCells, allRooms, form]);
  
  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 检查订单冲突
      const conflicts = checkOrderConflict(values.roomIds, values.dateRange, existingOrders);
      if (conflicts.length > 0) {
        message.error(`检测到${conflicts.length}个房间在所选时间内已有订单，请重新选择`);
        return;
      }
      
      // 创建新订单
      const newOrders: Order[] = values.roomIds.map((roomId, index) => ({
        id: `order_${Date.now()}_${index}`,
        roomId,
        checkin: values.dateRange[0],
        checkout: values.dateRange[1],
        netaboutplatform: values.platform,
        ordername: values.ordername || values.name,
      }));
      
      onConfirm(newOrders);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      title="创建订单"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      loading={loading}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="客户姓名"
          rules={[{ required: true, message: '请输入客户姓名' }]}
        >
          <Input placeholder="请输入客户姓名" />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="手机号码"
          rules={[
            { required: true, message: '请输入手机号码' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        >
          <Input placeholder="请输入手机号码" />
        </Form.Item>
        
        <Form.Item
          name="roomIds"
          label="房间选择"
          rules={[{ required: true, message: '请选择房间' }]}
        >
          <Select mode="multiple" placeholder="请选择房间">
            {allRooms.map(room => (
              <Option key={room.id} value={room.id}>
                {room.roomno} ({room.roomtype})
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="dateRange"
          label="入住日期范围"
          rules={[{ required: true, message: '请选择入住日期范围' }]}
        >
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['入住日期', '退房日期']}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>
        
        <Form.Item
          name="price"
          label="房费"
          rules={[{ required: true, message: '请输入房费' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入房费"
            addonAfter="元"
            min={0}
          />
        </Form.Item>
        
        <Form.Item
          name="platform"
          label="预订渠道"
          rules={[{ required: true, message: '请选择预订渠道' }]}
        >
          <Select placeholder="请选择预订渠道">
            <Option value={1}>携程</Option>
            <Option value={2}>美团</Option>
            <Option value={3}>飞猪</Option>
            <Option value={4}>酒店官网</Option>
            <Option value={5}>电话预订</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="ordername"
          label="订单名称（选填）"
        >
          <Input placeholder="默认使用客户姓名作为订单名称" />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="备注信息（选填）"
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModal;