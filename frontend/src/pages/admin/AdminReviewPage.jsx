import { useMemo } from 'react';
import { Card, Rate, Space, Switch, Table, Tag, Typography } from 'antd';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { useUiFeedback } from '../../context/UiFeedbackContext';

const { Title, Text } = Typography;

export default function AdminReviewPage() {
  const { toast } = useUiFeedback();
  const { data, loading, setData, error } = useFetch(() => api.get('/reviews/admin/all'), []);
  const reviews = data || [];

  const toggle = async (review, checked) => {
    const status = checked ? 1 : 0;
    try {
      await api.put(`/reviews/${review.id}/status`, { status });
      setData(reviews.map((item) => (item.id === review.id ? { ...item, status } : item)));
      toast(checked ? 'Đã hiện đánh giá' : 'Đã ẩn đánh giá');
    } catch (err) {
      toast(err.message || 'Không cập nhật được trạng thái', 'error');
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      render: (value) => <Text strong>{value}</Text>
    },
    {
      title: 'Khách',
      dataIndex: 'full_name'
    },
    {
      title: 'Sao',
      dataIndex: 'rating',
      width: 160,
      render: (rating) => <Rate disabled allowHalf value={Number(rating)} style={{ fontSize: 14 }} />
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      ellipsis: true
    },
    {
      title: 'Hiển thị',
      dataIndex: 'status',
      width: 140,
      align: 'center',
      render: (status, review) => (
        <Space>
          <Switch
            checked={Number(status) === 1}
            checkedChildren="Hiện"
            unCheckedChildren="Ẩn"
            onChange={(checked) => toggle(review, checked)}
          />
          <Tag color={Number(status) === 1 ? 'success' : 'default'}>
            {Number(status) === 1 ? 'Đang hiện' : 'Đã ẩn'}
          </Tag>
        </Space>
      )
    }
  ], [reviews]);

  if (error && !reviews.length) {
    return (
      <div className="admin-page">
        <Card><Text type="danger">{error}</Text></Card>
      </div>
    );
  }

  return (
    <div className="admin-page admin-antd-page">
      <div className="admin-antd-head">
        <Text className="admin-kicker">Nội dung</Text>
        <Title level={2} style={{ margin: '4px 0 6px', color: '#0e3740' }}>Quản lý đánh giá</Title>
        <Text type="secondary">Duyệt phản hồi khách hàng — bật/tắt hiển thị bằng công tắc.</Text>
      </div>

      <Card className="admin-list-card" title="Danh sách đánh giá" extra={<Text type="secondary">{reviews.length} đánh giá</Text>}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={reviews}
          loading={loading}
          className="admin-antd-table"
          pagination={reviews.length > 10 ? { pageSize: 10 } : false}
          locale={{ emptyText: 'Chưa có đánh giá nào.' }}
        />
      </Card>
    </div>
  );
}
