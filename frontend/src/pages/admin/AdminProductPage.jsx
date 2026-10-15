import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaEdit, FaImage, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import api, { imageUrl } from '../../api/client';
import Loading from '../../components/Loading';
import { money } from '../../utils/format';

const empty = {
  category_id: '',
  brand_id: '',
  name: '',
  image: '',
  price: '',
  sale_price: '',
  stock: 0,
  age_range: '',
  origin: '',
  weight: '',
  ingredients: '',
  benefits: '',
  usage_instructions: '',
  short_description: '',
  description: '',
  status: 1,
  is_featured: 0
};

const normalizeForm = (data) => ({
  ...data,
  sale_price: data.sale_price === '' ? null : data.sale_price
});

export default function AdminProductPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ categories: [], brands: [] });
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => Promise.all([
    api.get('/products/admin/all'),
    api.get('/categories'),
    api.get('/brands')
  ]).then(([products, categories, brands]) => {
    setItems(products.data);
    setMeta({ categories: categories.data, brands: brands.data });
  }).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      const payload = normalizeForm(form);
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu sản phẩm');
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      setUploading(true);
      const res = await api.post('/upload', data);
      setForm((current) => ({ ...current, image: res.data.url }));
      setPreviewOpen(false);
    } catch {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const edit = (product) => {
    setEditing(product.id);
    setForm({ ...empty, ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Kho hàng</span>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý kho hàng, giá bán, trạng thái hiển thị và thông tin chi tiết các sản phẩm sữa.</p>
        </div>
        <div className="admin-hero-metrics">
          <span><strong>{items.length}</strong> sản phẩm</span>
          <span><strong>{items.filter((item) => item.is_featured === 1).length}</strong> nổi bật</span>
        </div>
      </div>

      <form className="panel product-form" onSubmit={save}>
        <div className="panel-head product-form-head">
          <div>
            <h3>{editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <p>Thông tin càng rõ, khách hàng càng dễ chọn đúng sản phẩm.</p>
          </div>
        </div>

        <div className="span-2">
          <label>Tên sản phẩm</label>
          <input required placeholder="Nhập tên sản phẩm..." value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>

        <div>
          <label>Danh mục</label>
          <select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>
            <option value="">Chọn danh mục</option>
            {meta.categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </div>

        <div>
          <label>Thương hiệu</label>
          <select required value={form.brand_id} onChange={(event) => setForm({ ...form, brand_id: event.target.value })}>
            <option value="">Chọn thương hiệu</option>
            {meta.brands.map((brand) => <option value={brand.id} key={brand.id}>{brand.name}</option>)}
          </select>
        </div>

        <div>
          <label>Giá niêm yết</label>
          <input type="number" required placeholder="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
        </div>

        <div>
          <label>Giá khuyến mãi</label>
          <input type="number" placeholder="0" value={form.sale_price || ''} onChange={(event) => setForm({ ...form, sale_price: event.target.value })} />
        </div>

        <div>
          <label>Tồn kho</label>
          <input type="number" placeholder="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
        </div>

        <div className="span-2">
          <label>Hình ảnh</label>
          <div className="image-picker">
            <label className="upload-button image-picker-btn">
              <FaImage />
              {uploading ? 'Đang tải...' : form.image ? 'Đổi ảnh' : 'Chọn ảnh'}
              <input className="admin-file-input" type="file" accept="image/*" disabled={uploading} onChange={upload} />
            </label>
            {form.image && (
              <button type="button" className="btn ghost image-clear-btn" onClick={() => { setForm({ ...form, image: '' }); setPreviewOpen(false); }}>
                Xóa ảnh
              </button>
            )}
          </div>
          {form.image ? (
            <button type="button" className="image-thumb-btn" onClick={() => setPreviewOpen(true)} title="Xem ảnh lớn">
              <img className="admin-preview" src={imageUrl(form.image)} alt="Preview" />
              <span>Nhấn để xem lớn</span>
            </button>
          ) : (
            <div className="image-empty-hint">Chưa chọn ảnh</div>
          )}
          {previewOpen && form.image && createPortal(
            <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh" onClick={() => setPreviewOpen(false)}>
              <div className="image-lightbox-card" onClick={(event) => event.stopPropagation()}>
                <div className="image-lightbox-head">
                  <strong>Xem ảnh</strong>
                  <button type="button" className="btn ghost" onClick={() => setPreviewOpen(false)}>
                    <FaTimes /> Đóng
                  </button>
                </div>
                <img src={imageUrl(form.image)} alt="Ảnh xem lớn" />
              </div>
            </div>,
            document.body
          )}
        </div>

        <div>
          <label>Độ tuổi</label>
          <input placeholder="VD: 1-3 tuổi" value={form.age_range || ''} onChange={(event) => setForm({ ...form, age_range: event.target.value })} />
        </div>

        <div>
          <label>Xuất xứ</label>
          <input placeholder="VD: Việt Nam" value={form.origin || ''} onChange={(event) => setForm({ ...form, origin: event.target.value })} />
        </div>

        <div>
          <label>Khối lượng / Quy cách</label>
          <input placeholder="VD: Lon 800g" value={form.weight || ''} onChange={(event) => setForm({ ...form, weight: event.target.value })} />
        </div>

        <div className="span-3">
          <label>Mô tả ngắn</label>
          <textarea rows="2" placeholder="Tóm tắt đặc điểm nổi bật..." value={form.short_description || ''} onChange={(event) => setForm({ ...form, short_description: event.target.value })} />
        </div>

        <div className="span-3">
          <label>Mô tả chi tiết</label>
          <textarea rows="4" placeholder="Thông tin đầy đủ về sản phẩm..." value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </div>

        <div className="span-3">
          <label>Thành phần</label>
          <textarea rows="2" placeholder="Danh sách các thành phần dinh dưỡng..." value={form.ingredients || ''} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} />
        </div>

        <div className="span-3 two-column-fields">
          <div>
            <label>Công dụng</label>
            <textarea placeholder="Lợi ích mang lại..." value={form.benefits || ''} onChange={(event) => setForm({ ...form, benefits: event.target.value })} />
          </div>
          <div>
            <label>Hướng dẫn sử dụng</label>
            <textarea placeholder="Cách pha hoặc sử dụng..." value={form.usage_instructions || ''} onChange={(event) => setForm({ ...form, usage_instructions: event.target.value })} />
          </div>
        </div>

        <div className="span-3 admin-check-row">
          <label className="admin-check"><input type="checkbox" checked={Number(form.is_featured) === 1} onChange={(event) => setForm({ ...form, is_featured: event.target.checked ? 1 : 0 })} /> Sản phẩm nổi bật</label>
          <label className="admin-check"><input type="checkbox" checked={Number(form.status) === 1} onChange={(event) => setForm({ ...form, status: event.target.checked ? 1 : 0 })} /> Hiển thị bán</label>
        </div>

        <div className="span-3 form-actions">
          <button className="btn primary">{editing ? <><FaSave /> Cập nhật sản phẩm</> : <><FaPlus /> Thêm sản phẩm mới</>}</button>
          {editing && <button type="button" className="btn ghost" onClick={() => { setEditing(null); setForm(empty); }}><FaTimes /> Hủy bỏ</button>}
        </div>
      </form>

      <div className="panel table-wrap">
        <div className="panel-toolbar">
          <h3>Danh sách sản phẩm ({items.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="admin-media-cell">
                    <img src={imageUrl(product.image)} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <span className="muted block">{product.category_name} / {product.brand_name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {product.sale_price ? (
                    <div>
                      <strong className="price-highlight">{money(product.sale_price)}</strong>
                      <del className="muted block">{money(product.price)}</del>
                    </div>
                  ) : (
                    <strong>{money(product.price)}</strong>
                  )}
                </td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-chip ${product.status ? 'success' : 'muted'}`}>{product.status ? 'Đang bán' : 'Tạm ẩn'}</span>
                  {product.is_featured === 1 && <span className="status-chip warn compact">Hot</span>}
                </td>
                <td>
                  <div className="table-actions">
                    <button type="button" onClick={() => edit(product)}><FaEdit /> Sửa</button>
                    <button type="button" className="danger-link" onClick={() => remove(product.id)}><FaTrash /> Xóa</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6"><div className="empty-state">Chưa có sản phẩm nào.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
