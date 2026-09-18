import { useState } from 'react';
import { FaBoxOpen, FaHeadset, FaMapMarkerAlt, FaPhoneAlt, FaSave, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const initials = (user.full_name || 'KH')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Đã cập nhật thông tin tài khoản.');
    } catch (err) {
      setMessage(err.message || 'Không thể cập nhật thông tin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section profile-page">
      <div className="profile-shell">
        <div className="profile-hero panel">
          <div className="profile-identity">
            <div className="avatar-badge">{initials}</div>
            <div>
              <span className="section-kicker">Tài khoản của tôi</span>
              <h1>{user.full_name}</h1>
              <p>Quản lý thông tin liên hệ, địa chỉ giao hàng và theo dõi nhanh các hoạt động mua sắm tại Sữa Chi Mai.</p>
            </div>
          </div>

          <div className="profile-actions">
            <Link className="btn primary" to="/my-orders"><FaBoxOpen /> Đơn hàng</Link>
            <Link className="btn ghost" to="/cart"><FaShoppingCart /> Giỏ hàng</Link>
            <Link className="btn ghost" to="/contact"><FaHeadset /> Hỗ trợ</Link>
          </div>
        </div>

        <div className="profile-grid">
          <form className="panel profile-card profile-form" onSubmit={submit}>
            <div className="profile-card-head">
              <div>
                <h3>Cập nhật hồ sơ</h3>
                <p>Thông tin này sẽ được dùng khi bạn đặt hàng hoặc cần tư vấn.</p>
              </div>
            </div>

            {message && <div className={message.startsWith('Đã') ? 'alert success' : 'alert'}>{message}</div>}

            <label>
              Họ tên
              <input value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required />
            </label>
            <label>
              Số điện thoại
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Nhập số điện thoại" />
            </label>
            <label>
              Địa chỉ giao hàng
              <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Nhập địa chỉ nhận hàng mặc định" />
            </label>

            <button className="btn primary" disabled={saving}><FaSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
          </form>

          <aside className="profile-side">
            <div className="panel profile-card">
              <h3>Thông tin tài khoản</h3>
              <div className="info-list">
                <div className="info-row"><span><FaUserCircle /> Họ tên</span><strong>{user.full_name}</strong></div>
                <div className="info-row"><span>Email</span><strong>{user.email}</strong></div>
                <div className="info-row"><span><FaPhoneAlt /> Điện thoại</span><strong>{user.phone || 'Chưa cập nhật'}</strong></div>
                <div className="info-row"><span><FaMapMarkerAlt /> Địa chỉ</span><strong>{user.address || 'Chưa cập nhật'}</strong></div>
              </div>
            </div>

            <div className="panel profile-card profile-note-card">
              <h3>Gợi ý nhanh</h3>
              <p>Theo dõi đơn gần đây, kiểm tra trạng thái thanh toán hoặc gửi yêu cầu tư vấn nếu cần hỗ trợ chọn sản phẩm.</p>
              <Link className="btn accent" to="/my-orders">Theo dõi đơn hàng</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
