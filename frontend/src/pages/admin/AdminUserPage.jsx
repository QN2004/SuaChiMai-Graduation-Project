import { useMemo } from 'react';
import { Avatar, Card, Space, Switch, Table, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { useUiFeedback } from '../../context/UiFeedbackContext';

const { Title, Text } = Typography;

export default function AdminUserPage() {
  const { toast } = useUiFeedback();
  const { data, loading, setData, error } = useFetch(() => api.get('/users'), []);
  const users = data || [];

  const toggle = async (user, checked) => {
    const status = checked ? 1 : 0;
    try {
      await api.put(`/users/${user.id}/status`, { status });
      setData(users.map((item) => (item.id === user.id ? { ...item, status } : item)));
      toast(checked ? `Đã mở khóa ${user.full_name}` : `Đã khóa ${user.full_name}`);
    } catch (err) {
      toast(err.message || 'Không cập nhật được tài khoản', 'error');
    }
  };

  const activeUsers = users.filter((user) => user.status).length;
  const lockedUsers = users.filter((user) => !user.status).length;

  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      render: (id) => <Text type="secondary" strong>#{id}</Text>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'full_name',
      render: (name) => (
        <Space>
          <Avatar style={{ background: '#0c6b78' }} icon={<UserOutlined />}>
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text strong>{name}</Text>
        </Space>
      )
    },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (phone) => phone || '—'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (status) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? 'Đang hoạt động' : 'Đã khóa'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, user) => (
        <Switch
          checked={Number(user.status) === 1}
          checkedChildren="Mở"
          unCheckedChildren="Khóa"
          onChange={(checked) => toggle(user, checked)}
        />
      )
    }
  ], [users]);

  if (error && !users.length) {
    return (
      <div className="admin-page">
        <Card><Text type="danger">{error}</Text></Card>
      </div>
    );
  }

  return (
    <div className="admin-page admin-antd-page">
      <div className="admin-antd-head">
        <Text className="admin-kicker">Tài khoản hệ thống</Text>
        <Title level={2} style={{ margin: '4px 0 6px', color: '#0e3740' }}>Quản lý khách hàng</Title>
        <Text type="secondary">Theo dõi người dùng và khóa/mở khóa tài khoản khi cần.</Text>
      </div>

      <Space size={12} wrap style={{ marginBottom: 4 }}>
        <Card size="small" className="admin-stat-card"><Text type="secondary">Tổng</Text><div><Text strong style={{ fontSize: 22 }}>{users.length}</Text></div></Card>
        <Card size="small" className="admin-stat-card"><Text type="secondary">Hoạt động</Text><div><Text strong style={{ fontSize: 22, color: '#1a7f4b' }}>{activeUsers}</Text></div></Card>
        <Card size="small" className="admin-stat-card"><Text type="secondary">Đã khóa</Text><div><Text strong style={{ fontSize: 22, color: '#d6336c' }}>{lockedUsers}</Text></div></Card>
      </Space>

      <Card className="admin-list-card" title="Danh sách khách hàng">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          className="admin-antd-table"
          pagination={users.length > 10 ? { pageSize: 10 } : false}
          locale={{ emptyText: 'Chưa có khách hàng nào.' }}
        />
      </Card>
    </div>
  );
}
