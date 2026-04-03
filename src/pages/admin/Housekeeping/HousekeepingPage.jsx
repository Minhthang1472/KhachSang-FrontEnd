import React, { useState } from 'react';
import { Typography, Row, Col, Card, Badge, Avatar, Button, Tag, notification, Space, Divider } from 'antd';
import { ClearOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock Data
const initialTasks = [
  { id: '1', roomId: '101', roomType: 'Standard', status: 'todo', priority: 'high', notes: 'Khách yêu cầu dọn gấp' },
  { id: '2', roomId: '205', roomType: 'Deluxe', status: 'todo', priority: 'normal', notes: 'Dọn hàng ngày' },
  { id: '3', roomId: '302', roomType: 'VIP', status: 'todo', priority: 'high', notes: 'Chuẩn bị check-in 14:00' },
  { id: '4', roomId: '105', roomType: 'Superior', status: 'in-progress', priority: 'normal', notes: '', staff: 'Nguyễn Văn A' },
  { id: '5', roomId: '201', roomType: 'Standard', status: 'done', priority: 'normal', notes: '', staff: 'Trần Thị B', time: '10:30 AM' },
];

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus, staff: newStatus === 'in-progress' ? 'Tôi (Nhân viên)' : task.staff };
      }
      return task;
    }));
    
    const statusMessages = {
      'in-progress': 'Đã nhận việc dọn phòng!',
      'done': 'Đã hoàn tất dọn phòng!'
    };

    notification.success({
      message: statusMessages[newStatus],
      description: 'Hệ thống đã cập nhật trạng thái phòng.',
      placement: 'bottomRight'
    });
  };

  const renderTaskCard = (task) => (
    <Card 
      key={task.id} 
      className="room-card-hover"
      style={{ marginBottom: 16, borderLeft: task.priority === 'high' ? '4px solid #ff4d4f' : '4px solid #1890ff', borderRadius: 8 }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>P.{task.roomId}</Title>
          <Tag color={task.priority === 'high' ? 'error' : 'processing'}>
            {task.priority === 'high' ? 'Ưu tiên cao' : 'Thường'}
          </Tag>
        </Space>
        {task.status === 'done' && <Text type="secondary" style={{ fontSize: 12 }}>{task.time}</Text>}
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Loại: {task.roomType}</Text>
      
      {task.notes && (
        <div style={{ backgroundColor: '#fffbe6', padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>
          <Text style={{ fontSize: 13, color: '#d46b08' }}><ExclamationCircleOutlined /> {task.notes}</Text>
        </div>
      )}

      {task.staff && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 13 }}>Phụ trách: <strong>{task.staff}</strong></Text>
        </div>
      )}

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {task.status === 'todo' && (
          <Button type="primary" size="small" icon={<ClearOutlined />} onClick={() => moveTask(task.id, 'in-progress')}>
            Bắt đầu dọn
          </Button>
        )}
        {task.status === 'in-progress' && (
          <Button 
            type="primary" 
            size="small" 
            icon={<CheckCircleOutlined />} 
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => moveTask(task.id, 'done')}
          >
            Hoàn tất
          </Button>
        )}
      </div>
    </Card>
  );

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div style={{ padding: '0 10px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#1f1f1f' }}>Quản lý Dọn Phòng</Title>
        <Text type="secondary">Phân công và theo dõi tiến độ công việc buồng phòng (Housekeeping Kanban)</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột Cần Dọn */}
        <Col xs={24} md={8}>
          <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: 12, minHeight: 'calc(100vh - 200px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Badge color="#ff4d4f" style={{ marginRight: 8 }} />
              <Title level={5} style={{ margin: 0 }}>Cần dọn ({todoTasks.length})</Title>
            </div>
            {todoTasks.map(renderTaskCard)}
          </div>
        </Col>

        {/* Cột Đang Dọn */}
        <Col xs={24} md={8}>
          <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 12, minHeight: 'calc(100vh - 200px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Badge color="#1890ff" style={{ marginRight: 8 }} />
              <Title level={5} style={{ margin: 0 }}>Đang dọn ({inProgressTasks.length})</Title>
            </div>
            {inProgressTasks.map(renderTaskCard)}
          </div>
        </Col>

        {/* Cột Hoàn Tất */}
        <Col xs={24} md={8}>
          <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: 12, minHeight: 'calc(100vh - 200px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Badge color="#52c41a" style={{ marginRight: 8 }} />
              <Title level={5} style={{ margin: 0 }}>Đã xong ({doneTasks.length})</Title>
            </div>
            {doneTasks.map(renderTaskCard)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HousekeepingPage;
