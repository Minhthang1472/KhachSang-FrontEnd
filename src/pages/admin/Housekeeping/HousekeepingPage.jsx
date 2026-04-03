import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Badge, Button, Tag, Space, Divider, message, Spin } from 'antd';
import { ClearOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { roomApi } from '../../../api/roomApi';
import { useNotification } from '../../../context/notificationContext';

const { Title, Text } = Typography;

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  // Gọi API lấy dữ liệu phòng
  const fetchHousekeepingRooms = async () => {
    setLoading(true);
    try {
      const res = await roomApi.getHousekeepingRooms();
      // Chuyển đổi dữ liệu C# sang format của giao diện
      const mappedTasks = res.data.map(room => ({
        id: room.id,
        roomId: room.roomNumber,
        roomType: room.roomTypeName,
        floor: room.floor,
        column: room.status === 'Cleaning' ? 'in-progress' : 'todo',
        originalStatus: room.status 
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Lỗi lấy danh sách dọn phòng:', error);
      message.error('Không thể kết nối đến máy chủ Backend!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHousekeepingRooms();
  }, []);

  // Xử lý khi nhấn nút chuyển trạng thái
  const handleUpdateStatus = async (taskId, roomNumber, targetStatus) => {
    try {
      await roomApi.updateCleaningStatus(taskId, targetStatus);
      
      message.success(`Phòng ${roomNumber} đã chuyển sang: ${targetStatus}`);
      addNotification('Cập nhật buồng phòng', `Phòng ${roomNumber} -> ${targetStatus}`, 'success');

      // Tải lại dữ liệu
      fetchHousekeepingRooms();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      message.error(error.response?.data?.Message || 'Không thể cập nhật trạng thái phòng!');
    }
  };

  const renderTaskCard = (task) => (
    <Card 
      key={task.id} 
      className="room-card-hover"
      style={{ 
        marginBottom: 16, 
        borderLeft: task.originalStatus === 'Maintenance' ? '4px solid #faad14' : '4px solid #1890ff', 
        borderRadius: 8 
      }}
      // ✅ ĐÃ SỬA: Đổi bodyStyle thành styles.body theo chuẩn Ant Design mới
      styles={{ body: { padding: '16px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>P.{task.roomId}</Title>
          {task.originalStatus === 'Maintenance' && (
            <Tag color="warning">Bảo trì</Tag>
          )}
          {task.originalStatus === 'Dirty' && (
            <Tag color="error">Chưa dọn</Tag>
          )}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>Tầng {task.floor}</Text>
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Loại: <Text strong>{task.roomType}</Text></Text>

      {task.originalStatus === 'Maintenance' && (
        <div style={{ backgroundColor: '#fffbe6', padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>
          <Text style={{ fontSize: 13, color: '#d46b08' }}><ExclamationCircleOutlined /> Phòng đang bảo trì, cẩn thận khi dọn.</Text>
        </div>
      )}

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {task.column === 'todo' && (
          <Button 
            type="primary" 
            size="small" 
            icon={<ClearOutlined />} 
            onClick={() => handleUpdateStatus(task.id, task.roomId, 'Cleaning')}
          >
            Bắt đầu dọn
          </Button>
        )}
        {task.column === 'in-progress' && (
          <Button 
            type="primary" 
            size="small" 
            icon={<CheckCircleOutlined />} 
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleUpdateStatus(task.id, task.roomId, 'Available')}
          >
            Hoàn tất (Sẵn sàng)
          </Button>
        )}
      </div>
    </Card>
  );

  const todoTasks = tasks.filter(t => t.column === 'todo');
  const inProgressTasks = tasks.filter(t => t.column === 'in-progress');

  return (
    <div style={{ padding: '0 10px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#1f1f1f' }}>Quản lý Dọn Phòng</Title>
          <Text type="secondary">Phân công và theo dõi tiến độ công việc buồng phòng</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchHousekeepingRooms} loading={loading}>Làm mới</Button>
      </div>

      {/* ✅ ĐÃ SỬA: Đổi tip thành description để hết cảnh báo vàng */}
      <Spin spinning={loading} description="Đang tải dữ liệu buồng phòng...">
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
                <Title level={5} style={{ margin: 0 }}>Lưu trữ</Title>
              </div>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Text type="secondary">Các phòng sau khi bấm "Hoàn tất" sẽ tự động chuyển thành "Available" và biến mất khỏi bảng này.</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default HousekeepingPage;