import { useState } from 'react';
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
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
      <div className="contact-shell">
        <div className="contact-hero">
          <div className="contact-hero-copy">
            <span className="section-kicker">Liên hệ Sữa Chi Mai</span>
            <h1>Liên hệ &amp; tư vấn</h1>
            <p>Gửi câu hỏi hoặc liên hệ trực tiếp với cửa hàng qua thông tin bên dưới.</p>
          </div>
        </div>

        <div className="contact-layout">
          <aside className="contact-info-panel">
            <div className="contact-panel-heading">
              <h2>Sữa Chi Mai luôn ở đây khi bạn cần</h2>
              <p>Chọn kênh liên hệ thuận tiện nhất, chúng tôi sẽ phản hồi trong giờ mở cửa.</p>
            </div>

            <div className="contact-info-list">
              <InfoItem icon={<FaMapMarkerAlt />} title="Địa chỉ" text="Đại Nghĩa, Đại Lộc, Quảng Nam" />
              <InfoItem icon={<FaPhoneAlt />} title="Hotline" text="0987 654 321" href="tel:0987654321" />
              <InfoItem icon={<FaEnvelope />} title="Email" text="suachimai.dailoc@gmail.com" href="mailto:suachimai.dailoc@gmail.com" />
              <InfoItem icon={<FaClock />} title="Giờ mở cửa" text="7:00 - 22:00, tất cả các ngày" />
            </div>

            <div className="contact-note">
              <FaShieldAlt />
              <div>
                <strong>Tư vấn rõ ràng, đúng nhu cầu</strong>
                <p>Thông tin minh bạch và không gợi ý sản phẩm vượt quá nhu cầu sử dụng.</p>
              </div>
            </div>
          </aside>

          <form className="contact-form-card" onSubmit={submit}>
            <div className="contact-form-heading">
              <h2>Bạn cần chúng tôi hỗ trợ điều gì?</h2>
              <p>Điền thông tin ngắn gọn để cửa hàng chuẩn bị tư vấn phù hợp hơn.</p>
            </div>

            {message && <div className={message.startsWith('Đã gửi') ? 'alert success' : 'alert'}>{message}</div>}

            <div className="contact-form-grid">
              <label>
                <span>Họ tên</span>
                <input required placeholder="Nguyễn Văn A" value={form.full_name} onChange={(event) => update('full_name', event.target.value)} />
              </label>
              <label>
                <span>Số điện thoại</span>
                <input required inputMode="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
              </label>
            </div>

            <label>
              <span>Email <small>(không bắt buộc)</small></span>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={(event) => update('email', event.target.value)} />
            </label>

            <label>
              <span>Nội dung cần tư vấn</span>
              <textarea
                required
                placeholder="Bạn cần tư vấn sản phẩm cho bé, mẹ bầu hay gia đình?"
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
              />
            </label>

            <button className="btn primary" disabled={sending}>
              <FaPaperPlane /> {sending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon, title, text, href }) {
  const content = (
    <>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </>
  );

  return href
    ? <a className="contact-info-item" href={href}>{content}</a>
    : <div className="contact-info-item">{content}</div>;
}
