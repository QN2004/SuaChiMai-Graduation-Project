import { useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
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

  const load = () =>
    api.get(cfg.endpoint)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    setForm(empty);
    setEditing(null);
    setLoading(true);
    load();
  }, [type]);

  const upload = async (event, field) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/upload', data);
      setForm({ ...form, [field]: res.data.url });
    } catch {
      alert('Lỗi khi tải ảnh lên');
    }
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
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-hero modern-hero">
        <div>
          <span className="admin-kicker">Nội dung cửa hàng</span>
          <h1>Quản lý {cfg.title}</h1>
          <p>
            Thêm mới, chỉnh sửa và kiểm soát trạng thái hiển thị của{' '}
            {cfg.title.toLowerCase()} trên hệ thống.
          </p>
        </div>

        <div className="admin-hero-metrics">
          <span>
            <strong>{items.length}</strong>
            Tổng mục
          </span>
          <span>
            <strong>{editing ? 'Sửa' : 'Thêm'}</strong>
            Chế độ
          </span>
        </div>
      </div>

      <div className="admin-grid modern-admin-grid">
        <form className="panel modern-form" onSubmit={save}>
          <div className="panel-head modern-panel-head">
            <div>
              <h3>{editing ? 'Cập nhật' : 'Thêm mới'} {cfg.title}</h3>
              <p>Điền thông tin bên dưới để lưu dữ liệu.</p>
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
                return (
                  <div className="form-group" key={field}>
                    <label>{fieldLabels[field]}</label>

                    <div className="admin-upload-row modern-upload">
                      <input
                        placeholder="Dán link ảnh hoặc tải ảnh lên"
                        value={form[field]}
                        onChange={(event) =>
                          setForm({ ...form, [field]: event.target.value })
                        }
                      />

                      <label className="upload-button">
                        Chọn ảnh
                        <input
                          className="admin-file-input"
                          type="file"
                          onChange={(event) => upload(event, field)}
                        />
                      </label>
                    </div>

                    {form[field] && (
                      <div className="preview-box">
                        <img
                          className="admin-preview"
                          src={imageUrl(form[field])}
                          alt="Preview"
                        />
                      </div>
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
            <button className="btn primary">
              {editing ? <FaSave /> : <FaPlus />}
              {editing ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>

            {editing && (
              <button type="button" className="btn ghost" onClick={cancelEdit}>
                <FaTimes />
                Hủy bỏ
              </button>
            )}
          </div>
        </form>

        <div className="panel table-wrap modern-table-panel">
          <div className="panel-head modern-panel-head">
            <div>
              <h3>Danh sách {cfg.title}</h3>
              <p>Quản lý các mục đang có trong hệ thống.</p>
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
                          <div className="image-placeholder">No image</div>
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
                      Chưa có dữ liệu nào được thêm vào.
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