import { FaUserLock, FaUserCheck, FaUsers } from 'react-icons/fa';
import api from '../../api/client';
import Loading from '../../components/Loading';
import { useFetch } from '../../hooks/useFetch';

export default function AdminUserPage() {
  const { data, loading, setData } = useFetch(() => api.get('/users'), []);

  const toggle = async (user) => {
    const status = user.status ? 0 : 1;

    await api.put(`/users/${user.id}/status`, { status });

    setData(
      data.map((item) =>
        item.id === user.id
          ? { ...item, status }
          : item
      )
    );
  };

  if (loading) return <Loading />;

  const activeUsers = data.filter((user) => user.status).length;
  const lockedUsers = data.filter((user) => !user.status).length;

  return (
    <div className="admin-page">
      <div className="admin-hero modern-hero">
        <div>
          <span className="admin-kicker">Tài khoản hệ thống</span>

          <h1>Quản lý khách hàng</h1>

          <p>
            Theo dõi người dùng, kiểm soát trạng thái tài khoản
            và khóa hoặc mở khóa khi cần thiết.
          </p>
        </div>

        <div className="admin-hero-metrics">
          <span>
            <strong>{data.length}</strong>
            Tổng khách hàng
          </span>

          <span>
            <strong>{activeUsers}</strong>
            Đang hoạt động
          </span>

          <span>
            <strong>{lockedUsers}</strong>
            Đã khóa
          </span>
        </div>
      </div>

      <div className="panel modern-table-panel">
        <div className="panel-head modern-panel-head">
          <div>
            <h3>Danh sách khách hàng</h3>
            <p>Toàn bộ tài khoản đã đăng ký trên hệ thống.</p>
          </div>

          <div className="table-total">
            <FaUsers />
            {data.length} người dùng
          </div>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="id-pill">
                      #{user.id}
                    </span>
                  </td>

                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.full_name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <strong>{user.full_name}</strong>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>{user.phone || '---'}</td>

                  <td>
                    <span
                      className={`status-chip ${
                        user.status
                          ? 'success'
                          : 'danger'
                      }`}
                    >
                      {user.status
                        ? 'Đang hoạt động'
                        : 'Bị khóa'}
                    </span>
                  </td>

                  <td>
                    <div className="modern-table-actions">
                      <button
                        type="button"
                        className={
                          user.status
                            ? 'danger-btn'
                            : 'success-btn'
                        }
                        onClick={() => toggle(user)}
                      >
                        {user.status ? (
                          <>
                            <FaUserLock />
                            Khóa
                          </>
                        ) : (
                          <>
                            <FaUserCheck />
                            Mở khóa
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    Chưa có khách hàng nào.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}