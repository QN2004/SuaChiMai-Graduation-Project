import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';
import api from '../api/client';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';

const emptyFilters = {
  q: '',
  category: '',
  brand: '',
  sort: 'latest',
  minPrice: '',
  maxPrice: '',
  page: 1
};

const readFilters = (params) => ({
  q: params.get('q') || '',
  category: params.get('category') || '',
  brand: params.get('brand') || '',
  sort: params.get('sort') || 'latest',
  minPrice: params.get('minPrice') || '',
  maxPrice: params.get('maxPrice') || '',
  page: Number(params.get('page')) || 1
});

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(() => readFilters(params));
  const [searchInput, setSearchInput] = useState(() => params.get('q') || '');
  const [data, setData] = useState({ items: [], total: 0 });
  const [meta, setMeta] = useState({ brands: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/brands'), api.get('/categories')]).then(([brands, categories]) => {
      setMeta({ brands: brands.data || [], categories: categories.data || [] });
    });
  }, []);

  useEffect(() => {
    const next = readFilters(params);
    setFilters((current) => {
      const same = Object.keys(emptyFilters).every((key) => String(current[key]) === String(next[key]));
      return same ? current : next;
    });
    setSearchInput(next.q);
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => {
        if (current.q === searchInput) return current;
        return { ...current, q: searchInput, page: 1 };
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get('/products', { params: filters })
      .then((res) => {
        if (!alive) return;
        setData(res.data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    const next = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) next[key] = value;
    });
    setParams(next, { replace: true });

    return () => {
      alive = false;
    };
  }, [filters, setParams]);

  const update = (key, value) => setFilters((current) => ({
    ...current,
    [key]: value,
    page: key === 'page' ? value : 1
  }));

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ ...emptyFilters });
  };

  const pages = Math.max(1, Math.ceil(data.total / 12));
  const selectedCategory = meta.categories.find((item) => String(item.id) === String(filters.category));
  const selectedBrand = meta.brands.find((item) => String(item.id) === String(filters.brand));
  const hasActiveFilters = Boolean(
    filters.q || filters.category || filters.brand || filters.minPrice || filters.maxPrice || (filters.sort && filters.sort !== 'latest')
  );

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”` });
    if (selectedCategory) chips.push({ key: 'category', label: selectedCategory.name });
    if (selectedBrand) chips.push({ key: 'brand', label: selectedBrand.name });
    if (filters.minPrice) chips.push({ key: 'minPrice', label: `Từ ${Number(filters.minPrice).toLocaleString('vi-VN')}đ` });
    if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `Đến ${Number(filters.maxPrice).toLocaleString('vi-VN')}đ` });
    return chips;
  }, [filters, selectedBrand, selectedCategory]);

  const removeChip = (key) => {
    if (key === 'q') setSearchInput('');
    if (key === 'sort') update('sort', 'latest');
    else update(key, '');
  };

  const title = selectedCategory?.name || 'Tất cả sản phẩm';
  const subtitle = selectedCategory
    ? `Sản phẩm thuộc danh mục ${selectedCategory.name}.`
    : 'Tìm theo tên, lọc danh mục, thương hiệu và khoảng giá phù hợp.';

  return (
    <section className="section shop-page">
      <div className="shop-hero">
        <div className="shop-hero-copy">
          <span className="section-kicker">Cửa hàng</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="shop-hero-stat">
          <strong>{data.total}</strong>
          <span>sản phẩm</span>
        </div>
      </div>

      {meta.categories.length > 0 && (
        <div className="shop-category-pills" role="tablist" aria-label="Lọc nhanh theo danh mục">
          <button
            type="button"
            className={`shop-pill${!filters.category ? ' active' : ''}`}
            onClick={() => update('category', '')}
          >
            Tất cả
          </button>
          {meta.categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`shop-pill${String(filters.category) === String(category.id) ? ' active' : ''}`}
              onClick={() => update('category', String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-heading">
            <strong>
              <FaSlidersH aria-hidden="true" />
              Bộ lọc
            </strong>
            {hasActiveFilters && (
              <button type="button" className="filter-clear" onClick={clearFilters}>
                Xóa lọc
              </button>
            )}
          </div>

          <label className="filter-field">
            <span>Tìm kiếm</span>
            <div className="filter-search">
              <FaSearch />
              <input
                placeholder="Tên sản phẩm..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
          </label>

          <label className="filter-field">
            <span>Danh mục</span>
            <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
              <option value="">Tất cả danh mục</option>
              {meta.categories.map((category) => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Thương hiệu</span>
            <select value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
              <option value="">Tất cả thương hiệu</option>
              {meta.brands.map((brand) => (
                <option value={brand.id} key={brand.id}>{brand.name}</option>
              ))}
            </select>
          </label>

          <div className="filter-price-block">
            <span className="filter-price-label">Khoảng giá</span>
            <div className="filter-price-row">
              <label className="filter-field">
                <span className="visually-hidden">Giá từ</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={(event) => update('minPrice', event.target.value)}
                />
              </label>
              <span className="filter-price-sep" aria-hidden="true">–</span>
              <label className="filter-field">
                <span className="visually-hidden">Giá đến</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={(event) => update('maxPrice', event.target.value)}
                />
              </label>
            </div>
          </div>
        </aside>

        <div className="shop-results">
          <div className="shop-toolbar">
            <div className="shop-toolbar-meta">
              {loading ? (
                <span>Đang tải...</span>
              ) : (
                <span>
                  Hiển thị <strong>{data.items.length}</strong> / {data.total} sản phẩm
                </span>
              )}
            </div>
            <label className="shop-sort">
              <span>Sắp xếp</span>
              <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
                <option value="latest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="filter-chips">
              {activeChips.map((chip) => (
                <button type="button" className="filter-chip-btn" key={chip.key} onClick={() => removeChip(chip.key)}>
                  {chip.label}
                  <FaTimes />
                </button>
              ))}
              <button type="button" className="filter-chip-clear" onClick={clearFilters}>
                Xóa tất cả
              </button>
            </div>
          )}

          {loading ? (
            <Loading />
          ) : data.items.length ? (
            <div className="product-grid shop-product-grid">
              {data.items.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state shop-empty">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử đổi từ khóa, danh mục hoặc khoảng giá.</p>
              <button type="button" className="btn primary" onClick={clearFilters}>Xóa bộ lọc</button>
            </div>
          )}

          {data.items.length > 0 && pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, index) => (
                <button
                  className={filters.page === index + 1 ? 'active' : ''}
                  key={index}
                  type="button"
                  onClick={() => update('page', index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
