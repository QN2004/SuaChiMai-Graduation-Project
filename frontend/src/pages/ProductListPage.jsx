import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    category: '',
    brand: params.get('brand') || '',
    sort: params.get('sort') || 'latest',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    page: Number(params.get('page')) || 1
  });
  const [data, setData] = useState({ items: [], total: 0 });
  const [meta, setMeta] = useState({ brands: [] });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    api.get('/brands').then((brands) => setMeta({ brands: brands.data }));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: filters })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));

    const next = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) next[key] = value;
    });
    next.page = filters.page;
    setParams(next, { replace: true });
  }, [filters, setParams]);

  const loadMore = () => {
    if (loadingMore) return;
    const nextPage = filters.page + 1;
    setLoadingMore(true);
    api.get('/products', { params: { ...filters, page: nextPage } })
      .then((res) => {
        setData((prev) => ({ items: [...prev.items, ...res.data.items], total: res.data.total }));
        setFilters((current) => ({ ...current, page: nextPage }));
      })
      .finally(() => setLoadingMore(false));
  };

  const update = (key, value) => setFilters((current) => ({
    ...current,
    [key]: value,
    page: key === 'page' ? value : 1
  }));
  const pages = Math.max(1, Math.ceil(data.total / 12));

  return (
    <section className="section shop-page">
      <div className="section-title">
        <h2>Tất cả sản phẩm</h2>
        <span>{data.total} sản phẩm</span>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <input
            placeholder="Tìm sản phẩm..."
            value={filters.q}
            onChange={(event) => update('q', event.target.value)}
          />
          <select value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
            <option value="">Tất cả thương hiệu</option>
            {meta.brands.map((brand) => (
              <option value={brand.id} key={brand.id}>{brand.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Giá từ"
            value={filters.minPrice}
            onChange={(event) => update('minPrice', event.target.value)}
          />
          <input
            type="number"
            placeholder="Giá đến"
            value={filters.maxPrice}
            onChange={(event) => update('maxPrice', event.target.value)}
          />
          <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="latest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </aside>

        <div>
          {loading ? (
            <Loading />
          ) : (
            <div className="product-grid">
              {data.items.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          )}

          <div className="shop-actions">
            {filters.page < pages && (
              <button className="btn ghost" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Đang tải...' : 'Tải thêm'}
              </button>
            )}
          </div>

          <div className="pagination" style={{ marginTop: 12 }}>
            {Array.from({ length: pages }, (_, index) => (
              <button
                className={filters.page === index + 1 ? 'active' : ''}
                key={index}
                onClick={() => update('page', index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
