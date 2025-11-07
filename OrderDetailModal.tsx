import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Order } from './types';
import { getPlatformName, getOrderColor } from './utils/utils';
import dayjs from 'dayjs';

interface OrderDetailModalProps {
  visible: boolean;
  order: Order | null;
  onCancel: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, order, onCancel }) => {
  if (!order) return null;

  // 使用utils中已有的getOrderColor函数获取平台颜色
  const platformColor = getOrderColor(order.netaboutplatform);

  return (
    <Modal
      title="订单详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="订单编号">{order.id}</Descriptions.Item>
        <Descriptions.Item label="订单名称">{order.ordername || '未命名订单'}</Descriptions.Item>
        <Descriptions.Item label="房间ID">{order.roomId}</Descriptions.Item>
        <Descriptions.Item label="预订渠道">
          <Tag color={platformColor}>
            {getPlatformName(order.netaboutplatform)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="入住日期">
          {order.checkin.format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="退房日期">
          {order.checkout.format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="入住天数">
          {order.checkout.diff(order.checkin, 'days')} 天
        </Descriptions.Item>
        <Descriptions.Item label="身份证号码">
          {order.idNumber || '未填写'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default OrderDetailModal;