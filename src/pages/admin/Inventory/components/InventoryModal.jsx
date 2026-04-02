import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryModal = ({ visible, onClose, itemData, onSave }) => {
  const [form] = Form.useForm();

  // Load data to form when edit
  useEffect(() => {
    if (visible) {
      if (itemData) {
        form.setFieldsValue({
          ...itemData,
          category: itemData.category || 'DienTu',
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, itemData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={itemData ? 'Sửa thông tin vật tư' : 'Thêm vật tư mới'}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {/* Cột trái */}
          <div>
            <Form.Item name="itemCode" label="Mã vật tư" rules={[{ required: true, message: 'Vui lòng nhập mã vật tư!' }]}>
              <Input placeholder="Nhập mã vật tư" disabled={!!itemData} />
            </Form.Item>
            <Form.Item name="itemName" label="Tên vật tư" rules={[{ required: true, message: 'Vui lòng nhập tên vật tư!' }]}>
              <Input placeholder="vd: Tivi SamSung 55 inch" />
            </Form.Item>
            <Form.Item name="category" label="Danh mục">
              <Select>
                <Option value="DienTu">Điện tử</Option>
                <Option value="GiaDung">Gia dụng</Option>
                <Option value="NoiThat">Nội thất</Option>
                <Option value="ThucPham">Thực phẩm/Minibar</Option>
                <Option value="Khac">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="unit" label="Đơn vị tính">
              <Input placeholder="vd: cái, lon, chai" />
            </Form.Item>
          </div>

          {/* Cột phải */}
          <div>
            <Form.Item name="image" label="Hình ảnh vật tư">
              <Upload action="/upload.do" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
              </Upload>
            </Form.Item>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Item name="totalQuantity" label="Số lượng tổng" style={{ flex: 1 }} rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="importPrice" label="Giá nhập (VNĐ)" style={{ flex: 1 }} rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </div>
            <Form.Item name="compensationPrice" label="Giá đền bù/mất (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="supplier" label="Nhà cung cấp (Tùy chọn)">
              <Input placeholder="vd: Điện Máy Xanh" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default InventoryModal;
