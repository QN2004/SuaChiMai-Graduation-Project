import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Space, Tag, Tooltip, Upload } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import api, { imageUrl } from '../../api/client';
import { useUiFeedback } from '../../context/UiFeedbackContext';
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
  const { toast, confirm } = useUiFeedback();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ categories: [], brands: [] });
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');

  const load = () => Promise.all([
    api.get('/products/admin/all'),
    api.get('/categories'),
    api.get('/brands')
  ]).then(([products, categories, brands]) => {
    setItems(products.data);
    setMeta({ categories: categories.data, brands: brands.data });
  }).finally(() => setLoading(false));

  const clearPendingImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(null);
    setLocalPreview('');
  };

  const resetFormState = () => {
    clearPendingImage();
    setForm(empty);
    setEditing(null);
    setPreviewOpen(false);
  };

  useEffect(() => {
    load();
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = normalizeForm({ ...form, status: 1 });

      if (pendingFile) {
        const data = new FormData();
        data.append('image', pendingFile);
        const res = await api.post('/upload', data);
        payload.image = res.data.url;
      }

      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      toast(editing ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      resetFormState();
      load();
    } catch (err) {
      toast(err.message || 'Lỗi khi lưu sản phẩm', 'error');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = (file) => {
    if (!file) return false;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(file);
    setLocalPreview(URL.createObjectURL(file));
    setPreviewOpen(false);
    return false;
  };

  const clearImage = () => {
    clearPendingImage();
    setForm((current) => ({ ...current, image: '' }));
    setPreviewOpen(false);
  };

  const edit = (product) => {
    clearPendingImage();
    setEditing(product.id);
    setForm({ ...empty, ...product });
    setPreviewOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    const ok = await confirm({
      title: 'Xóa sản phẩm?',
      message: 'Thao tác này không thể hoàn tác. Bạn có chắc muốn xóa sản phẩm này?',
      confirmText: 'Xóa',
      cancelText: 'Giữ lại',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await api.delete(`/products/${id}`);
      toast('Đã xóa sản phẩm');
      load();
    } catch (err) {
      toast(err.message || 'Lỗi khi xóa', 'error');
    }
  };

  return (
    <div className={`admin-page${loading ? ' is-refreshing' : ''}`}>
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
          <Space wrap size={10}>
            <Upload accept="image/*" showUploadList={false} beforeUpload={pickImage} disabled={saving}>
              <Button icon={<PictureOutlined />} disabled={saving}>
                {(localPreview || form.image) ? 'Đổi ảnh' : 'Chọn ảnh'}
              </Button>
            </Upload>
            {(localPreview || form.image) && (
              <Button danger disabled={saving} onClick={clearImage}>Xóa ảnh</Button>
            )}
          </Space>
          {(localPreview || form.image) ? (
            <button type="button" className="image-thumb-btn" onClick={() => setPreviewOpen(true)} title="Xem ảnh lớn">
              <img className="admin-preview" src={localPreview || imageUrl(form.image)} alt="Preview" />
              <span>{pendingFile ? 'Chưa lưu — nhấn để xem lớn' : 'Nhấn để xem lớn'}</span>
            </button>
          ) : (
            <div className="image-empty-hint">Chưa chọn ảnh</div>
          )}
          {previewOpen && (localPreview || form.image) && createPortal(
            <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh" onClick={() => setPreviewOpen(false)}>
              <div className="image-lightbox-card" onClick={(event) => event.stopPropagation()}>
                <div className="image-lightbox-head">
                  <strong>Xem ảnh</strong>
                  <Button icon={<CloseOutlined />} onClick={() => setPreviewOpen(false)}>Đóng</Button>
                </div>
                <img src={localPreview || imageUrl(form.image)} alt="Ảnh xem lớn" />
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
          <label className="admin-check">
            <input
              type="checkbox"
              checked={Number(form.is_featured) === 1}
              onChange={(event) => setForm({ ...form, is_featured: event.target.checked ? 1 : 0 })}
            />
            Sản phẩm nổi bật
          </label>
        </div>

        <div className="span-3 form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            icon={editing ? <SaveOutlined /> : <PlusOutlined />}
          >
            {editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </Button>
          {editing && (
            <Button size="large" icon={<CloseOutlined />} onClick={resetFormState} disabled={saving}>
              Hủy bỏ
            </Button>
          )}
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
                  <Space size={6} wrap>
                    <Tag color={product.status ? 'success' : 'default'}>
                      {product.status ? 'Đang bán' : 'Tạm ẩn'}
                    </Tag>
                    {product.is_featured === 1 && <Tag color="gold">Hot</Tag>}
                  </Space>
                </td>
                <td>
                  <Space size={8}>
                    <Tooltip title="Sửa">
                      <Button type="primary" ghost shape="circle" icon={<EditOutlined />} onClick={() => edit(product)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => remove(product.id)} />
                    </Tooltip>
                  </Space>
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
