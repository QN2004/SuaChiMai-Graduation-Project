import { useState } from 'react';
import { FaClock, FaEnvelope, FaHeadset, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../api/client';

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setMessage('');
    try {
      await api.post('/contacts', form);
      setMessage('Đã gửi yêu cầu tư vấn. Sữa Chi Mai sẽ liên hệ lại sớm nhất.');
      setForm({ full_name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setMessage(err.message || 'Không thể gửi liên hệ. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <section className="contact-page">
      <div className="contact-hero">
        <div>
          <span className="section-kicker">Liên hệ Sữa Chi Mai</span>
          <h1>Tư vấn chọn sữa phù hợp cho gia đình bạn</h1>
          <p>Đội ngũ Sữa Chi Mai hỗ trợ chọn sản phẩm theo độ tuổi, nhu cầu dinh dưỡng, khẩu vị và ngân sách.</p>
        </div>
        <div className="contact-hero-card">
          <FaHeadset />
          <span>Hotline tư vấn</span>
          <strong>0987 654 321</strong>
          <small>7:00 - 22:00 tất cả các ngày</small>
        </div>
      </div>

      <div className="contact-layout">
        <div className="contact-info-panel">
          <InfoItem icon={<FaMapMarkerAlt />} title="Địa chỉ" text="Đại Nghĩa, Đại Lộc, Quảng Nam" />
          <InfoItem icon={<FaPhoneAlt />} title="Hotline" text="0987 654 321" />
          <InfoItem icon={<FaEnvelope />} title="Email" text="suachimai.dailoc@gmail.com" />
          <InfoItem icon={<FaClock />} title="Giờ mở cửa" text="7:00 - 22:00 tất cả các ngày trong tuần" />

          <div className="contact-note">
            <FaShieldAlt />
            <div>
              <strong>Cam kết tư vấn rõ ràng</strong>
              <p>Chúng tôi ưu tiên sản phẩm chính hãng, nguồn gốc minh bạch và gợi ý đúng nhu cầu sử dụng.</p>
            </div>
          </div>
        </div>

        <form className="contact-form-card" onSubmit={submit}>
          <div className="contact-form-heading">
            <span className="section-kicker">Gửi yêu cầu</span>
            <h2>Nhận tư vấn miễn phí</h2>
            <p>Điền thông tin bên dưới, cửa hàng sẽ liên hệ lại để hỗ trợ bạn chọn sản phẩm phù hợp.</p>
          </div>

          {message && <div className={message.startsWith('Đã gửi') ? 'alert success' : 'alert'}>{message}</div>}

          <div className="contact-form-grid">
            <input required placeholder="Họ tên" value={form.full_name} onChange={(event) => update('full_name', event.target.value)} />
            <input required placeholder="Số điện thoại" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
          </div>
          <input type="email" placeholder="Email" value={form.email} onChange={(event) => update('email', event.target.value)} />
          <textarea
            required
            placeholder="Bạn cần tư vấn sản phẩm cho bé, mẹ bầu hay gia đình?"
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
          />
          <button className="btn primary" disabled={sending}>
            <FaPaperPlane /> {sending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
          </button>
        </form>
      </div>
    </section>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="contact-info-item">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
