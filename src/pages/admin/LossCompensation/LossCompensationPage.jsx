import React, { useState } from 'react';
import { Typography, Table, Button, Select, Alert, Tag, Space, notification } from 'antd';
import { WarningOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ROOMS = [
  { id: '101', name: 'Phòng 101' },
  { id: '102', name: 'Phòng 102' },
  { id: '103', name: 'Phòng 103' },
  { id: '104', name: 'Phòng 104' },
  { id: '105', name: 'Phòng 105' },
  { id: '201', name: 'Phòng 201' },
  { id: '202', name: 'Phòng 202' },
  { id: '203', name: 'Phòng 203' },
  { id: '204', name: 'Phòng 204' },
];

const MOCK_CHECKLIST = [
  { id: 'TV01', name: 'Smart TV Samsung 43 inch', defaultQty: 1, status: 'ok' },
  { id: 'AC01', name: 'Điều hòa Daikin 9000 BTU', defaultQty: 1, status: 'ok' },
  { id: 'TW01', name: 'Khăn tắm cotton 70x140cm', defaultQty: 2, status: 'ok' },
  { id: 'WA01', name: 'Nước suối Lavie 500ml', defaultQty: 4, status: 'ok' },
  { id: 'CC01', name: 'Nước ngọt Coca Cola 320ml', defaultQty: 4, status: 'ok' },
  { id: 'OR01', name: 'Bánh Oreo 133g', defaultQty: 0, status: 'ok' },
  { id: 'KE01', name: 'Ấm đun nước siêu tốc Sunhouse', defaultQty: 1, status: 'ok' },
  { id: 'BL01', name: 'Chăn lông vũ', defaultQty: 1, status: 'ok' },
  { id: 'WD01', name: 'Tủ quần áo gỗ công nghiệp', defaultQty: 1, status: 'ok' },
];

const LossCompensationPage = () => {
  const [selectedRoom, setSelectedRoom] = useState('102');
  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredChecklist = checklist.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const handleReportBroken = (itemId) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, status: 'broken' };
      return item;
    }));
    notification.warning({
      message: 'Đã ghi nhận Hỏng/Mất',
      description: 'Vật tư đã được đánh dấu đỏ chờ xử lý đền bù.',
    });
  };

  const handleClearReport = (itemId) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, status: 'ok' };
      return item;
    }));
    notification.success({
      message: 'Đã hủy báo cáo',
    });
  };

  const columns = [
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng chuẩn',
      dataIndex: 'defaultQty',
      key: 'defaultQty',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'right',
      render: (_, record) => (
        <Space>
          {record.status === 'ok' ? (
            <Button
              danger
              icon={<WarningOutlined />}
              onClick={() => handleReportBroken(record.id)}
            >
              Báo hỏng / Mất
            </Button>
          ) : (
            <Space>
              <Tag color="error" style={{ padding: '4px 10px', fontSize: '14px', borderRadius: '4px' }}>
                <WarningOutlined /> Báo hỏng / Mất
              </Tag>
              <Button type="text" onClick={() => handleClearReport(record.id)}>Hủy báo cáo</Button>
            </Space>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0 20px 20px' }}>
      <div style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Thất thoát & Đền bù - Checklist Phòng</Title>
        <Space>
          <Text strong>Chọn phòng kiểm tra:</Text>
          <Select value={selectedRoom} onChange={setSelectedRoom} style={{ width: 200 }}>
            {ROOMS.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
          </Select>
        </Space>
      </div>

      <Alert 
        message={`Đang kiểm tra phòng: ${ROOMS.find(r => r.id === selectedRoom)?.name}`}
        description="Vui lòng kiểm tra danh sách đồ đạc bên dưới và nhấn [Báo hỏng / Mất] nếu phát hiện thiếu sót hoặc hư hỏng."
        type="info" 
        showIcon 
        style={{ margin: '20px 0' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <Text strong>Danh sách đồ đạc</Text>
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200 }}>
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="ok">Đang bình thường</Option>
          <Option value="broken">Đã báo Hỏng / Mất</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredChecklist}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          size="large" 
          icon={<CheckCircleOutlined />} 
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => notification.success({ message: 'Hoàn tất kiểm tra!' })}
        >
          Hoàn tất (Sạch sẽ)
        </Button>
      </div>
    </div>
  );
};

export default LossCompensationPage;
