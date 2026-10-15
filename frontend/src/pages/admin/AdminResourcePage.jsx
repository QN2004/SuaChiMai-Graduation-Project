import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tooltip,
  Typography,
  Upload
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PictureOutlined,
  SaveOutlined,
  CloseOutlined,
  InboxOutlined
} from '@ant-design/icons';
import api, { imageUrl } from '../../api/client';
import Loading from '../../components/Loading';
import { useUiFeedback } from '../../context/UiFeedbackContext';

const { Title, Text, Paragraph } = Typography;

const configs = {
  categories: {
    title: 'Danh mục',
    endpoint: '/categories',
    fields: ['name', 'description', 'image'],
    imageField: 'image'
  },
  brands: {
    title: 'Thương hiệu',
    endpoint: '/brands',
    fields: ['name', 'description', 'logo'],
    imageField: 'logo'
  }
};

export default function AdminResourcePage({ type }) {
  const cfg = configs[type];
  const { toast, confirm } = useUiFeedback();
  const [form] = Form.useForm();

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');
  const [savedImage, setSavedImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const imageSrc = localPreview || (savedImage ? imageUrl(savedImage) : '');

  const load = () =>
    api.get(cfg.endpoint)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));

  const clearPendingImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(null);
    setLocalPreview('');
  };

  const resetFormState = () => {
    clearPendingImage();
    setSavedImage('');
    setEditing(null);
    setPreviewOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    resetFormState();
    setLoading(true);
    load();
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const pickImage = (file) => {
    if (!file) return false;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(file);
    setLocalPreview(URL.createObjectURL(file));
    return false;
  };

  const clearImage = () => {
    clearPendingImage();
    setSavedImage('');
  };

  const save = async (values) => {
    try {
      setSaving(true);
      const payload = {
        name: values.name?.trim(),
        description: values.description || '',
        status: 1,
        [cfg.imageField]: savedImage || ''
      };

      if (pendingFile) {
        const data = new FormData();
        data.append('image', pendingFile);
        const res = await api.post('/upload', data);
        payload[cfg.imageField] = res.data.url;
      }

      if (editing) await api.put(`${cfg.endpoint}/${editing}`, payload);
      else await api.post(cfg.endpoint, payload);

      toast(editing ? `Đã cập nhật ${cfg.title.toLowerCase()}` : `Đã thêm ${cfg.title.toLowerCase()}`);
      resetFormState();
      load();
    } catch (err) {
      toast(err.message || 'Lỗi khi lưu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    clearPendingImage();
    setEditing(item.id);
    setSavedImage(item[cfg.imageField] || '');
    form.setFieldsValue({
      name: item.name || '',
      description: item.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    const ok = await confirm({
      title: `Xóa ${cfg.title.toLowerCase()}?`,
      message: 'Thao tác này không thể hoàn tác. Bạn có chắc muốn xóa mục này?',
      confirmText: 'Xóa',
      cancelText: 'Giữ lại',
      tone: 'danger'
    });
    if (!ok) return;

    try {
      await api.delete(`${cfg.endpoint}/${id}`);
      toast(`Đã xóa ${cfg.title.toLowerCase()}`);
      load();
    } catch (err) {
      toast(err.message || 'Lỗi khi xóa', 'error');
    }
  };

  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      render: (id) => <Text type="secondary" strong>#{id}</Text>
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, item) => {
        const src = item.image || item.logo;
        return (
          <Flex align="center" gap={14}>
            <Avatar
              shape="square"
              size={56}
              src={src ? imageUrl(src) : undefined}
              icon={!src ? <PictureOutlined /> : undefined}
              style={{
                borderRadius: 14,
                background: '#eef6f8',
                color: '#0c6b78',
                flexShrink: 0
              }}
            />
            <div style={{ minWidth: 0 }}>
              <Text strong style={{ display: 'block', color: '#102f3a' }}>
                {item.name || item.title}
              </Text>
              {(item.description || item.link) && (
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 1 }}
                  style={{ margin: '2px 0 0', maxWidth: 420 }}
                >
                  {item.description || item.link}
                </Paragraph>
              )}
            </div>
          </Flex>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, item) => (
        <Space size={8}>
          <Tooltip title="Sửa">
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => edit(item)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => remove(item.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ], [items, type]);

  if (loading) return <Loading />;

  return (
    <div className="admin-page admin-antd-page">
      <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap" className="admin-antd-head">
        <div>
          <Text className="admin-kicker">Nội dung cửa hàng</Text>
          <Title level={2} style={{ margin: '4px 0 6px', color: '#0e3740' }}>
            Quản lý {cfg.title.toLowerCase()}
          </Title>
          <Text type="secondary">Thêm mới và chỉnh sửa {cfg.title.toLowerCase()} trên trang bán hàng.</Text>
        </div>
        <Card size="small" className="admin-stat-card">
          <Statistic title={`Tổng ${cfg.title.toLowerCase()}`} value={items.length} />
        </Card>
      </Flex>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={9} xl={8}>
          <Card
            className="admin-form-card"
            title={
              <Flex justify="space-between" align="center" gap={12}>
                <span>{editing ? `Cập nhật ${cfg.title.toLowerCase()}` : `Thêm ${cfg.title.toLowerCase()}`}</span>
                <Text
                  className={`mode-badge ${editing ? 'edit' : 'create'}`}
                  style={{ margin: 0 }}
                >
                  {editing ? 'Đang sửa' : 'Tạo mới'}
                </Text>
              </Flex>
            }
          >
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={save}
              disabled={saving}
            >
              <Form.Item
                label="Tên gọi"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên gọi' }]}
              >
                <Input size="large" placeholder="Nhập tên gọi..." allowClear />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} placeholder="Nhập mô tả..." allowClear />
              </Form.Item>

              <Form.Item label={cfg.imageField === 'logo' ? 'Logo' : 'Ảnh đại diện'}>
                <Upload.Dragger
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={pickImage}
                  disabled={saving}
                  className="admin-upload-dragger"
                >
                  {imageSrc ? (
                    <div className="admin-upload-preview" onClick={(e) => e.stopPropagation()}>
                      <img src={imageSrc} alt="Preview" />
                      <Space>
                        <Button size="small" onClick={() => setPreviewOpen(true)}>Xem lớn</Button>
                        <Button size="small" danger onClick={clearImage}>Xóa ảnh</Button>
                      </Space>
                      {pendingFile && <Text type="secondary">Chưa lưu — sẽ upload khi nhấn thêm</Text>}
                    </div>
                  ) : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Kéo ảnh vào đây hoặc bấm để chọn</p>
                      <p className="ant-upload-hint">PNG, JPG, WEBP · chỉ preview, chưa lưu server</p>
                    </>
                  )}
                </Upload.Dragger>
              </Form.Item>

              <Flex gap={10}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={saving}
                  icon={editing ? <SaveOutlined /> : <PlusOutlined />}
                  style={{ flex: 1 }}
                >
                  {editing ? 'Lưu thay đổi' : `Thêm ${cfg.title.toLowerCase()}`}
                </Button>
                {editing && (
                  <Button size="large" icon={<CloseOutlined />} onClick={resetFormState}>
                    Hủy
                  </Button>
                )}
              </Flex>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={15} xl={16}>
          <Card
            className="admin-list-card"
            title={`Danh sách ${cfg.title.toLowerCase()}`}
            extra={<Text type="secondary">{items.length} mục</Text>}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              pagination={items.length > 8 ? { pageSize: 8, showSizeChanger: false } : false}
              locale={{ emptyText: <Empty description={`Chưa có ${cfg.title.toLowerCase()}`} /> }}
              className="admin-antd-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        open={previewOpen && Boolean(imageSrc)}
        title="Xem ảnh"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={720}
      >
        <Image src={imageSrc} alt="Ảnh xem lớn" style={{ width: '100%' }} preview={false} />
      </Modal>
    </div>
  );
}
