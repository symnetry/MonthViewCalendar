import { useState } from 'react';
import { ProTable, FooterToolbar, ModalForm, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Space, Modal } from 'antd';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { RoomType } from '@/pages/dashboard/moonview/types';
import { mockRoomTypes } from '@/pages/dashboard/moonview/mockData';

const STORAGE_KEY_ROOM_TYPES = 'hotel_room_types';

const RoomTypeList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  
  // 使用useLocalStorage钩子获取和存储数据
  const [roomTypes] = useLocalStorage<RoomType[]>(STORAGE_KEY_ROOM_TYPES, mockRoomTypes);
  
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleRequest = async (params: any) => {
    try {
      setLoading(true);
      // 简单的过滤逻辑
      let filteredRoomTypes = [...roomTypes];
      
      if (params.name) {
        filteredRoomTypes = filteredRoomTypes.filter(roomType => 
          roomType.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.price) {
        filteredRoomTypes = filteredRoomTypes.filter(roomType => 
          roomType.price === Number(params.price)
        );
      }
      
      // 处理排序
      if (params.sorter) {
        const { field, order } = params.sorter;
        filteredRoomTypes.sort((a, b) => {
          if (order === 'ascend') {
            return a[field as keyof RoomType] > b[field as keyof RoomType] ? 1 : -1;
          } else {
            return a[field as keyof RoomType] < b[field as keyof RoomType] ? 1 : -1;
          }
        });
      }
      
      return {
        data: filteredRoomTypes,
        success: true,
        total: filteredRoomTypes.length,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };
  
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的房型');
      return;
    }
    
    modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRows.length} 个房型吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          
          // 检查是否有房间使用这些房型
          const rooms = localStorage.getItem('rooms');
          if (rooms) {
            const roomsData = JSON.parse(rooms);
            const hasRoomWithType = selectedRows.some(roomType => 
              roomsData.some((room: any) => room.roomtypeId === roomType.id)
            );
            
            if (hasRoomWithType) {
              message.error('选中的房型中有被房间使用的，无法删除');
              return;
            }
          }
          
          const updatedRoomTypes = roomTypes.filter(roomType => 
            !selectedRows.find(selected => selected.id === roomType.id)
          );
          localStorage.setItem(STORAGE_KEY_ROOM_TYPES, JSON.stringify(updatedRoomTypes));
          message.success('批量删除成功');
          handleClearSelection();
        } catch (error) {
          message.error('批量删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };
  
  const handleDelete = async (id: string) => {
    modal.confirm({
      title: '确认删除',
      content: '确定要删除这个房型吗？',
      onOk: async () => {
        try {
          setLoading(true);
          
          // 检查是否有房间使用此房型
          const rooms = localStorage.getItem('rooms');
          if (rooms) {
            const roomsData = JSON.parse(rooms);
            if (roomsData.some((room: any) => room.roomtypeId === id)) {
              message.error('该房型下还有房间，无法删除');
              return;
            }
          }
          
          const updatedRoomTypes = roomTypes.filter(roomType => roomType.id !== id);
          localStorage.setItem(STORAGE_KEY_ROOM_TYPES, JSON.stringify(updatedRoomTypes));
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };
  
  const handleAdd = () => {
    setCurrentRoomType(null);
    setAddModalVisible(true);
  };
  
  const handleEdit = (roomType: RoomType) => {
    setCurrentRoomType(roomType);
    setEditModalVisible(true);
  };
  
  // 获取最大排序号
  const getMaxSort = (): number => {
    if (roomTypes.length === 0) return 0;
    return Math.max(...roomTypes.map(roomType => roomType.sort || 0));
  };
  
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      
      // 转换为正确的数据类型
      const formattedValues = {
        ...values,
        price: Number(values.price),
        sort: Number(values.sort),
      };
      
      let updatedRoomTypes: RoomType[];
      
      if (currentRoomType?.id) {
        // 编辑现有房型
        updatedRoomTypes = roomTypes.map(roomType => 
          roomType.id === currentRoomType.id ? { ...roomType, ...formattedValues } : roomType
        );
        message.success('更新成功');
        setEditModalVisible(false);
      } else {
        // 新增房型
        const newRoomType: RoomType = {
          id: `type_${Date.now()}`,
          name: formattedValues.name,
          description: formattedValues.description || '',
          price: formattedValues.price || 0,
          sort: formattedValues.sort || getMaxSort() + 1,
        };
        updatedRoomTypes = [...roomTypes, newRoomType];
        message.success('添加成功');
        setAddModalVisible(false);
      }
      
      localStorage.setItem(STORAGE_KEY_ROOM_TYPES, JSON.stringify(updatedRoomTypes));
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 列配置
  const columns: ProColumns<RoomType>[] = [
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
      search: {
        show: true,
        placeholder: '请输入房型名称',
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      search: {
        show: true,
        placeholder: '请输入价格',
      },
    },
    {
      title: '排序号',
      dataIndex: 'sort',
      key: 'sort',
      search: {
        show: true,
        placeholder: '请输入排序号',
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <div>
      {contextHolder}
      <ProTable
        rowKey="id"
        columns={columns}
        request={handleRequest}
        loading={loading}
        headerTitle="房型管理"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增房型
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`,
          pageSize: 10
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[], rows: RoomType[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
          }
        }}
      >
        <FooterToolbar
          extra={
            <Space>
              <span>已选择 {selectedRows.length} 项</span>
              <Button onClick={handleClearSelection}>取消全选</Button>
            </Space>
          }
        >
          <Button
            type="primary"
            danger
            disabled={selectedRows.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        </FooterToolbar>
      </ProTable>

      {/* 新增房型模态框 */}
      <ModalForm
        title="新增房型"
        open={addModalVisible}
        onOpenChange={setAddModalVisible}
        onFinish={handleSave}
      >
        <ProFormText name="name" label="房型名称" rules={[{ required: true }]} placeholder="请输入房型名称" />
        <ProFormTextArea name="description" label="描述" placeholder="请输入房型描述" />
        <ProFormDigit 
          name="price" 
          label="价格" 
          rules={[{ required: true, type: 'number', min: 0, message: '价格不能为负数' }]}
          placeholder="请输入价格"
          min={0}
        />
        <ProFormDigit 
          name="sort" 
          label="排序号" 
          initialValue={getMaxSort() + 1}
          placeholder="请输入排序号"
          min={0}
        />
      </ModalForm>

      {/* 编辑房型模态框 */}
      <ModalForm
        title="编辑房型"
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleSave}
        initialValues={currentRoomType}
      >
        <ProFormText name="name" label="房型名称" rules={[{ required: true }]} placeholder="请输入房型名称" />
        <ProFormTextArea name="description" label="描述" placeholder="请输入房型描述" />
        <ProFormDigit 
          name="price" 
          label="价格" 
          rules={[{ required: true, type: 'number', min: 0, message: '价格不能为负数' }]}
          placeholder="请输入价格"
          min={0}
        />
        <ProFormDigit 
          name="sort" 
          label="排序号" 
          placeholder="请输入排序号"
          min={0}
        />
      </ModalForm>
    </div>
  );
};

export default RoomTypeList;