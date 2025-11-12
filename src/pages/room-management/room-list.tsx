import { useState } from 'react';
import { ProTable, FooterToolbar, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Space, Modal } from 'antd';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { Room, RoomType } from '@/pages/dashboard/moonview/types';
import { mockRooms, mockRoomTypes } from '@/pages/dashboard/moonview/mockData';

const STORAGE_KEY_ROOMS = 'rooms';
const STORAGE_KEY_ROOM_TYPES = 'hotel_room_types';

const RoomList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  const [deleteTargetId, setDeleteTargetId] = useState('');
  // 使用useLocalStorage钩子获取和存储数据
  const [rooms, setRooms] = useLocalStorage<Room[]>(STORAGE_KEY_ROOMS, mockRooms);
  const [roomTypes] = useLocalStorage<RoomType[]>(STORAGE_KEY_ROOM_TYPES, mockRoomTypes);

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的房间');
      return;
    }
    
    modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRows.length} 个房间吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          const updatedRooms = rooms.filter(room => 
            !selectedRows.find(selected => selected.id === room.id)
          );
          setRooms(updatedRooms);
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
      content: '确定要删除这个房间吗？',
      onOk: async () => {
        try {
          setLoading(true);
          const updatedRooms = rooms.filter(room => room.id !== id);
          setRooms(updatedRooms);
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
    setCurrentRoom(null);
    setAddModalVisible(true);

  };

  const handleEdit = (room: Room) => {
    setCurrentRoom(room);
    setEditModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      
      if (currentRoom?.id) {
        // 编辑现有房间
        const updatedRooms = rooms.map(room => 
          room.id === currentRoom.id ? { ...room, ...values, roomno: values.roomno || room.roomno } : room
        );
        setRooms(updatedRooms);
        message.success('更新成功');
        setEditModalVisible(false);
      } else {
        // 新增房间
        const newRoom: Room = {
          id: Date.now().toString(),
          roomno: values.roomno,
          roomtypeId: values.roomtypeId,
          roomtype: values.roomtype || roomTypes.find(type => type.id === values.roomtypeId)?.name || '',
          sort: rooms.length + 1
        };
        setRooms([...rooms, newRoom]);
        message.success('添加成功');
        setAddModalVisible(false);
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (params: any) => {
    try {
      setLoading(true);
      // 简单的过滤逻辑
      let filteredRooms = [...rooms];
      
      if (params.roomno) {
        filteredRooms = filteredRooms.filter(room => 
          room.roomno.includes(params.roomno)
        );
      }
      
      if (params.roomtype && params.roomtype.length > 0) {
        filteredRooms = filteredRooms.filter(room => 
          params.roomtype.includes(room.roomtype)
        );
      }
      
      return {
        data: filteredRooms,
        success: true,
        total: filteredRooms.length,
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

  // 转换房型为选项格式
  const roomTypeOptions = roomTypes.map(type => ({
    label: type.name,
    value: type.id,
  }));

  // 列配置
  const columns: ProColumns<Room>[] = [
    {
      title: '房间号',
      dataIndex: 'roomno',
      key: 'roomno',
      search: {
        show: true,
        placeholder: '请输入房间号',
      },
    },
    {
      title: '房型',
      dataIndex: 'roomtype',
      key: 'roomtype',
      search: {
        show: true,
        placeholder: '请选择房型',
        optionFilterProp: 'children',
        mode: 'multiple',
        options: roomTypes.map(type => ({ label: type.name, value: type.name })),
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
        headerTitle="房间管理"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增房间
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
          onChange: (keys: React.Key[], rows: Room[]) => {
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

      {/* 新增房间模态框 */}
      <ModalForm
        title="新增房间"
        open={addModalVisible}
        onOpenChange={setAddModalVisible}
        onFinish={handleSave}
      >
        <ProFormText name="roomno" label="房间号" rules={[{ required: true }]} />
        <ProFormSelect
          name="roomtypeId"
          label="房型"
          options={roomTypeOptions}
          rules={[{ required: true }]}
        />
      </ModalForm>

      {/* 编辑房间模态框 */}
      <ModalForm
        title="编辑房间"
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleSave}
        initialValues={currentRoom ? { ...currentRoom, roomtypeId: currentRoom.roomtypeId } : undefined}
      >
        <ProFormText name="roomno" label="房间号" rules={[{ required: true }]} />
        <ProFormSelect
          name="roomtypeId"
          label="房型"
          options={roomTypeOptions}
          rules={[{ required: true }]}
        />
      </ModalForm>
    </div>
  );
};

export default RoomList;