import React, { useState } from 'react';
import { Typography, Table, Button, Input, Select, Tag, Popconfirm, Avatar, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import InventoryModal from './components/InventoryModal';

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu mẫu ban đầu
const MOCK_INVENTORY_DATA = [
  {
    id: 'TV-01',
    itemCode: 'TV-SS-55',
    itemName: 'Tivi SamSung 55 inch',
    image: 'https://via.placeholder.com/50',
    unit: 'Cái',
    category: 'DienTu',
    totalQuantity: 50,
    inStock: 10,
    inUse: 38,
    brokenMissing: 2,
    importPrice: 15000000,
    compensationPrice: 17000000,
  },
  {
    id: 'DR-133',
    itemCode: 'BN-OR-133',
    itemName: 'Bánh Oreo 133g',
    image: 'https://via.placeholder.com/50',
    unit: 'Hộp',
    category: 'ThucPham',
    totalQuantity: 100,
    inStock: 75,
    inUse: 25,
    brokenMissing: 0,
    importPrice: 25000,
    compensationPrice: 30000,
  },
  {
    id: 'MI-OM',
    itemCode: 'MI-OM-01',
    itemName: 'Mì ly Omachi',
    image: 'https://via.placeholder.com/50',
    unit: 'Ly',
    category: 'ThucPham',
    totalQuantity: 200,
    inStock: 150,
    inUse: 50,
    brokenMissing: 0,
    importPrice: 18000,
    compensationPrice: 25000,
  },
  {
    id: 'CO-330',
    itemCode: 'NC-CC-330',
    itemName: 'Nước ngọt Coca Cola 330ml',
    image: 'https://via.placeholder.com/50',
    unit: 'Lon',
    category: 'ThucPham',
    totalQuantity: 300,
    inStock: 250,
    inUse: 45,
    brokenMissing: 5,
    importPrice: 12000,
    compensationPrice: 20000,
  },
];

const InventoryPage = () => {
  const [data, setData] = useState(MOCK_INVENTORY_DATA);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.itemName.toLowerCase().includes(searchText.toLowerCase()) || item.itemCode.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    notification.success({ message: 'Đã xóa vật tư thành công!' });
  };

  const handleOpenEdit = (record) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleSaveModal = (values) => {
    if (editingItem) {
      // Sửa
      setData((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)));
      notification.success({ message: 'Cập nhật vật tư thành công!' });
    } else {
      // Thêm mới
      const newItem = {
        ...values,
        id: `NEW-${Date.now()}`,
        inStock: values.totalQuantity,
        inUse: 0,
        brokenMissing: 0,
      };
      setData((prev) => [newItem, ...prev]);
      notification.success({ message: 'Thêm vật tư thành công!' });
    }
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img) => <Avatar src={img} shape="square" size="large" />
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.itemCode}</div>
        </div>
      )
    },
    { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
    { title: 'Tổng', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { title: 'Tồn kho', dataIndex: 'inStock', key: 'inStock' },
    { title: 'Đang dùng', dataIndex: 'inUse', key: 'inUse' },
    {
      title: 'Hỏng / Mất',
      dataIndex: 'brokenMissing',
      key: 'brokenMissing',
      render: (val) => (val > 0 ? <Tag color="red">{val}</Tag> : <span style={{ color: '#ccc' }}>0</span>)
    },
    {
      title: 'Giá đền bù',
      dataIndex: 'compensationPrice',
      key: 'compensationPrice',
      render: (val) => formatCurrency(val)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa vật tư này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '0', background: '#fff', borderRadius: '8px' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Danh mục Quản lý Kho vật tư</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm vật tư mới
        </Button>
      </div>

      <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        <Input
          placeholder="Tìm tên hoặc mã vật tư..."
          prefix={<SearchOutlined style={{ color: '#ccc' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
        />
        <Select 
          value={filterCategory} 
          onChange={setFilterCategory} 
          style={{ width: '200px' }}
        >
          <Option value="All">--- Tất cả danh mục ---</Option>
          <Option value="DienTu">Điện tử</Option>
          <Option value="ThucPham">Thực phẩm/Minibar</Option>
          <Option value="GiaDung">Gia dụng</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ padding: '0 20px' }}
      />

      <InventoryModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        itemData={editingItem}
        onSave={handleSaveModal}
      />
    </div>
  );
};

export default InventoryPage;
