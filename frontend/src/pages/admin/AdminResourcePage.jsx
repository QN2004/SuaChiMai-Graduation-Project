import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaEdit, FaSave, FaTrash, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import api, { imageUrl } from '../../api/client';
import Loading from '../../components/Loading';

const configs = {
  categories: { title: 'Danh mục', endpoint: '/categories', fields: ['name', 'description', 'image', 'status'] },
  brands: { title: 'Thương hiệu', endpoint: '/brands', fields: ['name', 'description', 'logo', 'status'] }
};

const fieldLabels = {
  name: 'Tên gọi',
  title: 'Tiêu đề',
  description: 'Mô tả',
  content: 'Nội dung',
  image: 'Ảnh đại diện',
  logo: 'Logo',
  link: 'Đường dẫn liên kết'
};

export default function AdminResourcePage({ type }) {
  const cfg = configs[type];
  const empty = Object.fromEntries(
    cfg.fields.map((field) => [field, field === 'status' ? 1 : ''])
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    api.get(cfg.endpoint)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    setForm(empty);
    setEditing(null);
    setPreviewOpen(false);
    setLoading(true);
    load();
  }, [type]);

  const upload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      const res = await api.post('/upload', data);
      setForm((current) => ({ ...current, [field]: res.data.url }));
      setPreviewOpen(false);
    } catch {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const clearImage = (field) => {
    setForm((current) => ({ ...current, [field]: '' }));
    setPreviewOpen(false);
  };

  const save = async (event) => {
    event.preventDefault();

    try {
      if (editing) await api.put(`${cfg.endpoint}/${editing}`, form);
      else await api.post(cfg.endpoint, form);

      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm(Object.fromEntries(cfg.fields.map((field) => [field, item[field] ?? ''])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) return;

    try {
      await api.delete(`${cfg.endpoint}/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(empty);
    setPreviewOpen(false);
  };

  if (loading) return <Loading />;

  const visibleCount = items.filter((item) => Number(item.status) === 1).length;

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Nội dung cửa hàng</span>
          <h1>Quản lý {cfg.title.toLowerCase()}</h1>
          <p>
            Thêm mới, chỉnh sửa và bật/tắt hiển thị {cfg.title.toLowerCase()} trên trang bán hàng.
          </p>
        </div>

        <div className="admin-hero-metrics">
          <span>
            <strong>{items.length}</strong>
            Tổng {cfg.title.toLowerCase()}
          </span>
          <span>
            <strong>{visibleCount}</strong>
            Đang hiện
          </span>
        </div>
      </div>

      <div className="admin-grid modern-admin-grid">
        <form className="panel modern-form" onSubmit={save}>
          <div className="panel-head modern-panel-head">
            <div>
              <h3>{editing ? 'Cập nhật' : 'Thêm'} {cfg.title.toLowerCase()}</h3>
              <p>{editing ? 'Chỉnh thông tin rồi lưu thay đổi.' : 'Điền thông tin để tạo mục mới.'}</p>
            </div>

            <div className={`mode-badge ${editing ? 'edit' : 'create'}`}>
              {editing ? 'Đang sửa' : 'Tạo mới'}
            </div>
          </div>

          <div className="form-stack">
            {cfg.fields.map((field) => {
              if (field === 'content' || field === 'description') {
                return (
                  <div className="form-group" key={field}>
                    <label>{fieldLabels[field]}</label>
                    <textarea
                      placeholder={`Nhập ${fieldLabels[field].toLowerCase()}...`}
                      value={form[field]}
                      onChange={(event) =>
                        setForm({ ...form, [field]: event.target.value })
                      }
                    />
                  </div>
                );
              }

              if (field === 'image' || field === 'logo') {
                const imageSrc = form[field] ? imageUrl(form[field]) : '';
                return (
                  <div className="form-group" key={field}>
                    <label>{fieldLabels[field]}</label>

                    <div className="image-picker">
                      <label className="upload-button image-picker-btn">
                        <FaImage />
                        {uploading ? 'Đang tải...' : form[field] ? 'Đổi ảnh' : 'Chọn ảnh'}
                        <input
                          className="admin-file-input"
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={(event) => upload(event, field)}
                        />
                      </label>

                      {form[field] && (
                        <button
                          type="button"
                          className="btn ghost image-clear-btn"
                          onClick={() => clearImage(field)}
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>

                    {form[field] ? (
                      <button
                        type="button"
                        className="image-thumb-btn"
                        onClick={() => setPreviewOpen(true)}
                        title="Xem ảnh lớn"
                      >
                        <img
                          className="admin-preview"
                          src={imageSrc}
                          alt="Preview"
                        />
                        <span>Nhấn để xem lớn</span>
                      </button>
                    ) : (
                      <div className="image-empty-hint">Chưa chọn ảnh</div>
                    )}

                    {previewOpen && form[field] && createPortal(
                      <div
                        className="image-lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Xem ảnh"
                        onClick={() => setPreviewOpen(false)}
                      >
                        <div
                          className="image-lightbox-card"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="image-lightbox-head">
                            <strong>Xem ảnh</strong>
                            <button
                              type="button"
                              className="btn ghost"
                              onClick={() => setPreviewOpen(false)}
                            >
                              <FaTimes /> Đóng
                            </button>
                          </div>
                          <img src={imageSrc} alt="Ảnh xem lớn" />
                        </div>
                      </div>,
                      document.body
                    )}
                  </div>
                );
              }

              if (field === 'status') {
                return (
                  <label className="admin-check modern-check" key={field}>
                    <input
                      type="checkbox"
                      checked={Number(form[field]) === 1}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          [field]: event.target.checked ? 1 : 0
                        })
                      }
                    />
                    <span>Hiển thị trên hệ thống</span>
                  </label>
                );
              }

              return (
                <div className="form-group" key={field}>
                  <label>{fieldLabels[field] || field}</label>
                  <input
                    required={field === 'name'}
                    placeholder={`Nhập ${fieldLabels[field]?.toLowerCase() || field}...`}
                    value={form[field]}
                    onChange={(event) =>
                      setForm({ ...form, [field]: event.target.value })
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="form-actions modern-actions">
            <button className="btn primary" type="submit">
              {editing ? <FaSave /> : <FaPlus />}
              {editing ? 'Lưu thay đổi' : `Thêm ${cfg.title.toLowerCase()}`}
            </button>

            {editing && (
              <button type="button" className="btn ghost" onClick={cancelEdit}>
                <FaTimes />
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="panel table-wrap modern-table-panel">
          <div className="panel-head modern-panel-head">
            <div>
              <h3>Danh sách {cfg.title.toLowerCase()}</h3>
              <p>{items.length} mục trong hệ thống.</p>
            </div>
          </div>

          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thông tin</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {items.length ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="id-pill">#{item.id}</span>
                    </td>

                    <td>
                      <div className="admin-media-cell modern-media-cell">
                        {(item.image || item.logo) ? (
                          <img
                            src={imageUrl(item.image || item.logo)}
                            alt={item.name || item.title}
                          />
                        ) : (
                          <div className="image-placeholder">No img</div>
                        )}

                        <div>
                          <strong>{item.name || item.title}</strong>
                          {(item.description || item.content || item.link) && (
                            <p>
                              {item.description || item.content || item.link}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`status-chip ${item.status ? 'success' : 'muted'}`}>
                        {item.status ? 'Đang hiện' : 'Đang ẩn'}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions modern-table-actions">
                        <button type="button" onClick={() => edit(item)}>
                          <FaEdit />
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="danger-link"
                          onClick={() => remove(item.id)}
                        >
                          <FaTrash />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      Chưa có dữ liệu. Hãy thêm {cfg.title.toLowerCase()} đầu tiên.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
