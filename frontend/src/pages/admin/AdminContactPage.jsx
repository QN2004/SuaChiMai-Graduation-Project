import { useCallback, useMemo, useState } from 'react';
import { FaEnvelope, FaInbox, FaPhoneAlt, FaReply, FaRegClock } from 'react-icons/fa';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';

const contactStatusText = {
  new: 'Mới',
  read: 'Đã đọc',
  replied: 'Đã phản hồi'
};

const formatDate = (value) => {
  if (!value) return 'Chưa có';
  return new Date(value).toLocaleString('vi-VN');
};

export default function AdminContactPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState('');

  const fetchContacts = useCallback(() => api.get('/contacts'), [refreshKey]);
  const { data, loading, error } = useFetch(fetchContacts, [fetchContacts]);
  const contacts = Array.isArray(data) ? data : [];
  const activeContact = contacts.find((contact) => contact.id === activeId) || contacts[0];

  const stats = useMemo(() => ({
    total: contacts.length,
    newCount: contacts.filter((item) => item.status === 'new').length,
    replied: contacts.filter((item) => item.status === 'replied').length
  }), [contacts]);

  const reload = () => setRefreshKey((value) => value + 1);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setNotice('');
    try {
      await api.put(`/contacts/${id}/status`, { status });
      setNotice('Đã cập nhật trạng thái liên hệ.');
      reload();
    } finally {
      setUpdatingId(null);
    }
  };

  const saveReply = async (contact) => {
    const reply = (replyDrafts[contact.id] ?? contact.reply_message ?? '').trim();
    if (!reply) {
      setNotice('Vui lòng nhập nội dung phản hồi trước khi lưu.');
      return;
    }

    setUpdatingId(contact.id);
    setNotice('');
    try {
      await api.put(`/contacts/${contact.id}/reply`, { reply_message: reply });
      setReplyDrafts((current) => ({ ...current, [contact.id]: reply }));
      setNotice('Đã lưu phản hồi cho khách hàng.');
      reload();
    } finally {
      setUpdatingId(null);
    }
  };

  const draft = activeContact ? (replyDrafts[activeContact.id] ?? activeContact.reply_message ?? '') : '';

  return (
    <div className={`admin-page${loading ? ' is-refreshing' : ''}`}>
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Hộp thư tư vấn</span>
          <h1>Liên hệ khách hàng</h1>
          <p>Quản lý tin nhắn khách gửi theo dạng inbox, trả lời nhanh và theo dõi trạng thái xử lý.</p>
        </div>
        <div className="admin-hero-metrics">
          <span><strong>{stats.total}</strong> yêu cầu</span>
          <span><strong>{stats.newCount}</strong> mới</span>
          <span><strong>{stats.replied}</strong> đã phản hồi</span>
        </div>
      </div>

      {notice && <div className="alert success">{notice}</div>}
      {error && <div className="alert">{error}</div>}

      <div className="admin-inbox">
        <aside className="inbox-list panel">
          <div className="inbox-list-head">
            <h3>Tin nhắn</h3>
            <span>{contacts.length}</span>
          </div>
          {contacts.length ? contacts.map((contact) => {
            const isActive = activeContact?.id === contact.id;
            const preview = contact.message;

            return (
              <button
                type="button"
                className={`inbox-item ${isActive ? 'active' : ''}`}
                key={contact.id}
                onClick={() => {
                  setActiveId(contact.id);
                  if (contact.status === 'new') updateStatus(contact.id, 'read');
                }}
              >
                <span className="inbox-avatar">{(contact.full_name || contact.name || 'K').charAt(0).toUpperCase()}</span>
                <span className="inbox-item-body">
                  <strong>{contact.full_name || contact.name || 'Khách hàng'}</strong>
                  <small>{preview || 'Khách chưa nhập nội dung.'}</small>
                </span>
                <span className={`status-chip ${contact.status === 'new' ? 'warn' : contact.status === 'replied' ? 'success' : 'muted'}`}>
                  {contactStatusText[contact.status] || contact.status}
                </span>
              </button>
            );
          }) : (
            <div className="empty-state"><FaInbox /> Chưa có yêu cầu tư vấn nào.</div>
          )}
        </aside>

        <section className="inbox-thread panel">
          {activeContact ? (
            <>
              <div className="thread-head">
                <div>
                  <h3>{activeContact.full_name || activeContact.name || 'Khách hàng'}</h3>
                  <p><FaRegClock /> {formatDate(activeContact.created_at)}</p>
                </div>
                <span className={`status-chip ${activeContact.status === 'new' ? 'warn' : activeContact.status === 'replied' ? 'success' : 'muted'}`}>
                  {contactStatusText[activeContact.status] || activeContact.status}
                </span>
              </div>

              <div className="thread-contact-lines">
                <a href={`tel:${activeContact.phone || ''}`}><FaPhoneAlt /> {activeContact.phone || 'Chưa có số điện thoại'}</a>
                <a href={`mailto:${activeContact.email || ''}`}><FaEnvelope /> {activeContact.email || 'Chưa có email'}</a>
              </div>

              <div className="message-stream">
                <div className="message-row customer">
                  <div className="message-bubble">
                    {activeContact.message || 'Khách chưa nhập nội dung.'}
                  </div>
                </div>

                {activeContact.reply_message && (
                  <div className="message-row admin">
                    <div className="message-bubble">
                      {activeContact.reply_message}
                      <small>Đã phản hồi: {formatDate(activeContact.replied_at)}</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="reply-composer">
                <textarea
                  rows="4"
                  value={draft}
                  placeholder="Nhập phản hồi cho khách hàng..."
                  onChange={(event) => setReplyDrafts((current) => ({ ...current, [activeContact.id]: event.target.value }))}
                />
                <div>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={updatingId === activeContact.id || activeContact.status === 'read'}
                    onClick={() => updateStatus(activeContact.id, 'read')}
                  >
                    Đánh dấu đã đọc
                  </button>
                  <button className="btn primary" disabled={updatingId === activeContact.id} onClick={() => saveReply(activeContact)}>
                    <FaReply /> Gửi phản hồi
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state"><FaInbox /> Chọn một tin nhắn để xem chi tiết.</div>
          )}
        </section>
      </div>
    </div>
  );
}
