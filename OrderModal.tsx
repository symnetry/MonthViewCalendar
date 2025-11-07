import React, { useEffect } from 'react';
import { Modal, message } from 'antd';
import { ProForm, ProFormText, ProFormSelect, ProFormDateRangePicker, ProFormDigit } from '@ant-design/pro-components';
import { CellData, Order, Room } from './types';
import dayjs from 'dayjs';
import { checkOrderConflict } from './utils/orderUtils';
import { otaPlatformEnum } from './utils/utils';

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
  // 从OTA平台配置获取选项
  const platformOptions = otaPlatformEnum.map(platform => ({
    label: platform.label,
    value: platform.value,
  }));
  
  // 从房间数据获取选项
  const roomOptions = allRooms.map(room => ({
    label: `${room.roomno} (${room.roomtype})`,
    value: room.id,
  }));
  
  // 从选中单元格中提取房间和日期信息
  useEffect(() => {
    if (visible && selectedCells.length > 0) {
      // 通过rowIndex确定房间，假设rowIndex与房间数组索引对应
      // 排除第0行（可能是表头）
      const roomIndices = [...new Set(selectedCells
        .filter(cell => typeof cell.rowIndex === 'number' && cell.rowIndex > 0)
        .map(cell => cell.rowIndex - 1))]; // 减去1得到房间数组的索引
      
      const selectedRoomIds = roomIndices
        .filter(index => index >= 0 && index < allRooms.length)
        .map(index => allRooms[index].id);
      
      // 提取选中的日期范围
      const dates = selectedCells
        .filter(cell => cell.fullDate)
        .map(cell => dayjs(cell.fullDate));
      
      const minDate = dates.length > 0 ? dates.reduce((min, current) => current.isBefore(min) ? current : min) : dayjs();
      const maxDate = dates.length > 0 ? dates.reduce((max, current) => current.isAfter(max) ? current : max).add(1, 'day') : dayjs().add(1, 'day');
      
      // 使用formRef.current?.setFieldsValue可能更合适，但这里简化处理
      // 在实际使用中，需要通过ProForm的formRef来获取表单实例
    }
  }, [visible, selectedCells, allRooms]);
  
  // 处理表单提交
  const handleSubmit = async (values: OrderFormData) => {
    try {
      // 确保日期范围是dayjs对象
      const [checkin, checkout] = values.dateRange;
      const dateRange = [
        typeof checkin === 'string' ? dayjs(checkin) : checkin,
        typeof checkout === 'string' ? dayjs(checkout) : checkout
      ] as [dayjs.Dayjs, dayjs.Dayjs];
      
      // 检查订单冲突
      const conflicts = checkOrderConflict(values.roomIds, dateRange, existingOrders);
      if (conflicts.length > 0) {
        message.error(`检测到${conflicts.length}个房间在所选时间内已有订单，请重新选择`);
        return false;
      }
      
      // 创建新订单
      const newOrders: Order[] = values.roomIds.map((roomId, index) => ({
        id: `order_${Date.now()}_${index}`,
        roomId,
        checkin: dateRange[0],
        checkout: dateRange[1],
        netaboutplatform: values.platform,
        ordername: values.ordername || values.name,
      }));
      
      onConfirm(newOrders);
      return true;
    } catch (error) {
      console.error('表单提交失败:', error);
      return false;
    }
  };
  
  // 初始值生成函数
  const getInitialValues = () => {
    if (!visible || selectedCells.length === 0) return {};
    
    // 提取选中的房间IDs
    const roomIndices = [...new Set(selectedCells
      .filter(cell => typeof cell.rowIndex === 'number' && cell.rowIndex > 0)
      .map(cell => cell.rowIndex - 1))];
    
    const selectedRoomIds = roomIndices
      .filter(index => index >= 0 && index < allRooms.length)
      .map(index => allRooms[index].id);
    
    // 提取选中的日期范围
    const dates = selectedCells
      .filter(cell => cell.fullDate)
      .map(cell => dayjs(cell.fullDate));
    
    const minDate = dates.length > 0 ? dates.reduce((min, current) => current.isBefore(min) ? current : min) : dayjs();
    const maxDate = dates.length > 0 ? dates.reduce((max, current) => current.isAfter(max) ? current : max).add(1, 'day') : dayjs().add(1, 'day');
    
    return {
      roomIds: selectedRoomIds,
      dateRange: [minDate, maxDate],
      price: 0,
      platform: 1,
    };
  };
  
  return (
    <Modal
      title="创建订单"
      open={visible}
      onCancel={onCancel}
      footer={null} // 禁用默认的footer，由ProForm提供
      width={700}
    >
      <ProForm
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={getInitialValues()}

      >
        <ProFormText
          name="name"
          label="客户姓名"
          placeholder="请输入客户姓名"
          rules={[{ required: true, message: '请输入客户姓名' }]}
        />
        
        <ProFormText
          name="phone"
          label="手机号码"
          placeholder="请输入手机号码"
          rules={[
            { required: true, message: '请输入手机号码' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        />
        
        <ProFormSelect
          name="roomIds"
          label="房间选择"
          placeholder="请选择房间"
          mode="multiple"
          options={roomOptions}
          rules={[{ required: true, message: '请选择房间' }]}
        />
        
        <ProFormDateRangePicker
          name="dateRange"
          label="入住日期范围"
          placeholder={['入住日期', '退房日期']}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
          rules={[{ required: true, message: '请选择入住日期范围' }]}
          fieldProps={{
            style: { width: '100%' },
          }}
        />
        
        <ProFormDigit
          name="price"
          label="房费"
          placeholder="请输入房费"
          addonAfter="元"
          min={0}
          rules={[{ required: true, message: '请输入房费' }]}
        />
        
        <ProFormSelect
          name="platform"
          label="预订渠道"
          placeholder="请选择预订渠道"
          options={platformOptions}
          rules={[{ required: true, message: '请选择预订渠道' }]}
        />
        
        <ProFormText
          name="ordername"
          label="订单名称（选填）"
          placeholder="默认使用客户姓名作为订单名称"
        />
        
        <ProFormText
          name="notes"
          label="备注信息（选填）"
          placeholder="请输入备注信息"
          fieldProps={{
            rows: 3,
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default OrderModal;