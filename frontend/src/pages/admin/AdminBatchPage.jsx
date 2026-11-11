import { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { FaEdit, FaTags } from 'react-icons/fa';
import api from '../../api/client';
import { useUiFeedback } from '../../context/UiFeedbackContext';
import { money } from '../../utils/format';
import { batchStatus, formatDate } from '../../utils/expiry';

const emptyForm = { product_id: '', lot_number: '', manufactured_date: '', expiry_date: '', quantity: '' };

export default function AdminBatchPage() {
  const { toast } = useUiFeedback();
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ product_id: '', status: '', in_stock: '1' });
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [discountRow, setDiscountRow] = useState(null);
  const [discountValue, setDiscountValue] = useState('');

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filter).filter(([, value]) => value));
    return api.get('/batches', { params })
      .then((res) => setBatches(res.data))
      .catch((err) => toast(err.message || 'Không tải được danh sách lô', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/products/admin/all').then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Thống kê luôn tính trên toàn bộ lô còn hàng, không phụ thuộc bộ lọc đang chọn.
  const [allLots, setAllLots] = useState([]);
  useEffect(() => {
    api.get('/batches', { params: { in_stock: '1' } }).then((res) => setAllLots(res.data)).catch(() => {});
  }, [batches]);
  const counts = useMemo(() => ({
    total: allLots.length,
    near: allLots.filter((b) => b.status === 'NEAR_EXPIRY').length,
    needDiscount: allLots.filter((b) => b.status === 'NEAR_EXPIRY' && !b.discount_percent).length,
    blocked: allLots.filter((b) => b.status === 'BLOCKED' || b.status === 'EXPIRED').length
  }), [allLots]);
  const statCards = [
    ['', 'ok', counts.total, 'Lô còn hàng'],
    ['NEAR_EXPIRY', 'warn', counts.near, `Lô cận date · ${counts.needDiscount} chờ duyệt xả hàng`],
    ['BLOCKED', 'bad', allLots.filter((b) => b.status === 'BLOCKED').length, 'Ngừng bán online (không đủ hạn)'],
    ['EXPIRED', 'bad', allLots.filter((b) => b.status === 'EXPIRED').length, 'Đã hết hạn']
  ];

  const save = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      if (editing) await api.put(`/batches/${editing}`, payload);
      else await api.post('/batches', payload);
      toast(editing ? 'Đã cập nhật lô' : 'Đã nhập lô hàng');
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      toast(err.message || 'Không lưu được lô', 'error');
    }
  };

  const edit = (batch) => {
    setEditing(batch.id);
    setForm({
      product_id: batch.product_id,
      lot_number: batch.lot_number,
      manufactured_date: batch.manufactured_date,
      expiry_date: batch.expiry_date,
      quantity: batch.quantity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDiscount = (batch) => {
    setDiscountRow(batch.id);
    setDiscountValue(batch.discount_percent || batch.suggestedDiscount || 10);
  };

  const applyDiscount = async (batch, value) => {
    try {
      const res = await api.put(`/batches/${batch.id}/discount`, { discount_percent: Number(value) });
      toast(res.message);
      setDiscountRow(null);
      load();
    } catch (err) {
      toast(err.message || 'Không áp dụng được giảm giá', 'error');
    }
  };

  return (
    <div className={`admin-page${loading ? ' is-refreshing' : ''}`}>
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Kho hàng</span>
          <h1>Lô hàng – hạn sử dụng</h1>
          <p>Nhập kho theo lô, bán theo FEFO (hết hạn trước – xuất trước). Lô còn ≤ 15% vòng đời là cận date; lô còn ít hạn hơn thời gian sử dụng + thời gian giao thì tự ngừng bán online.</p>
        </div>
      </div>

      <div className="batch-stats">
        {statCards.map(([status, tone, value, label]) => (
          <button
            key={label}
            type="button"
            className={`batch-stat ${tone}${filter.status === status && filter.in_stock === '1' ? ' active' : ''}`}
            onClick={() => setFilter({ ...filter, status, in_stock: '1' })}
          >
            <strong>{value}</strong>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form className="panel product-form batch-form" onSubmit={save}>
        <div className="panel-head">
          <div>
            <h3>{editing ? 'Sửa lô (chưa xuất cho đơn nào)' : 'Nhập lô hàng'}</h3>
            <p>Số lượng nhập được cộng vào tồn bán được nếu lô còn đủ hạn.</p>
          </div>
        </div>
        <div>
          <label>Sản phẩm</label>
          <select required disabled={Boolean(editing)} value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
            <option value="">Chọn sản phẩm</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Số lô</label>
          <input required maxLength={50} placeholder="L240915" value={form.lot_number} onChange={(e) => setForm({ ...form, lot_number: e.target.value })} />
        </div>
        <div>
          <label>Ngày sản xuất</label>
          <input type="date" required value={form.manufactured_date} onChange={(e) => setForm({ ...form, manufactured_date: e.target.value })} />
        </div>
        <div>
          <label>Hạn sử dụng</label>
          <input type="date" required value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
        </div>
        <div>
          <label>Số lượng</label>
          <input type="number" min="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>
        <div className="form-actions">
          <Button type="primary" htmlType="submit" icon={editing ? <SaveOutlined /> : <PlusOutlined />}>{editing ? 'Lưu' : 'Nhập lô'}</Button>
          {editing && <Button onClick={() => { setEditing(null); setForm(emptyForm); }}>Hủy</Button>}
        </div>
      </form>

      <div className="panel table-wrap">
        <div className="panel-toolbar">
          <h3>Danh sách lô</h3>
          <div className="batch-filters">
            <select value={filter.product_id} onChange={(e) => setFilter({ ...filter, product_id: e.target.value })}>
              <option value="">Tất cả sản phẩm</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(batchStatus).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
            <select value={filter.in_stock} onChange={(e) => setFilter({ ...filter, in_stock: e.target.value })}>
              <option value="1">Còn hàng</option>
              <option value="">Cả lô đã bán hết</option>
            </select>
          </div>
        </div>
        <table className="batch-table">
          <thead>
            <tr><th>Sản phẩm</th><th>Số lô</th><th>NSX → HSD</th><th>Còn / nhập</th><th>Vòng đời còn</th><th>Trạng thái</th><th>Xả hàng cận date</th><th className="col-actions">Thao tác</th></tr>
          </thead>
          <tbody>
            {batches.length ? batches.map((batch) => {
              const status = batchStatus[batch.status];
              const pct = Math.max(0, Math.min(100, batch.remainingPercent));
              return (
                <tr key={batch.id}>
                  <td><strong>{batch.product_name}</strong><span className="sub">Dùng hết ~{batch.usage_days} ngày</span></td>
                  <td>{batch.lot_number}</td>
                  <td>
                    {formatDate(batch.manufactured_date)} → <strong>{formatDate(batch.expiry_date)}</strong>
                    <span className="sub">{batch.remainingDays >= 0 ? `còn ${batch.remainingDays} ngày` : `quá hạn ${-batch.remainingDays} ngày`}</span>
                  </td>
                  <td><strong>{batch.remaining}</strong> / {batch.quantity}</td>
                  <td>
                    <div className="life-bar">
                      <div className="life-bar-track"><div className={`life-bar-fill ${status.tone}`} style={{ width: `${pct}%` }} /></div>
                      <small>{pct}%</small>
                    </div>
                  </td>
                  <td><span className={`tone-chip ${status.tone}`}>{status.label}</span></td>
                  <td>
                    {batch.status === 'NEAR_EXPIRY' && batch.remaining > 0 && (discountRow === batch.id ? (
                      <div className="batch-discount-edit">
                        <div className="row">
                          <span className="pct-input"><input type="number" min="1" max="90" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />%</span>
                          <button type="button" className="mini-btn primary" onClick={() => applyDiscount(batch, discountValue)}>Duyệt</button>
                          <button type="button" className="mini-btn" onClick={() => setDiscountRow(null)}>Hủy</button>
                        </div>
                        <small>Gợi ý {batch.suggestedDiscount}% · giá mới {money(Math.round((batch.sale_price || batch.price) * (100 - Number(discountValue || 0)) / 100))}</small>
                      </div>
                    ) : batch.discount_percent ? (
                      <div className="batch-discount-edit">
                        <span className="discount-now"><span className="tone-chip warn">−{batch.discount_percent}%</span> <strong>{money(batch.unit_price)}</strong></span>
                        <span className="row">
                          <button type="button" className="mini-btn ghost" onClick={() => openDiscount(batch)}>Đổi mức</button>
                          <button type="button" className="mini-btn ghost danger" onClick={() => applyDiscount(batch, 0)}>Bỏ giảm</button>
                        </span>
                      </div>
                    ) : (
                      <button type="button" className="mini-btn soft" onClick={() => openDiscount(batch)}>
                        <FaTags /> Tạo giảm {batch.suggestedDiscount}%
                      </button>
                    ))}
                    {(batch.status === 'BLOCKED' || batch.status === 'EXPIRED') && batch.remaining > 0 && <span className="sub">Đã khóa – xử lý ngoài web</span>}
                    {batch.status === 'NORMAL' && <span className="sub">—</span>}
                  </td>
                  <td className="col-actions">
                    {batch.used
                      ? <span className="sub" title="Lô đã xuất cho đơn hàng nên không sửa được">Đã xuất đơn</span>
                      : <button type="button" className="mini-btn ghost" onClick={() => edit(batch)}><FaEdit /> Sửa</button>}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan="8"><div className="empty-state">Không có lô phù hợp bộ lọc.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
