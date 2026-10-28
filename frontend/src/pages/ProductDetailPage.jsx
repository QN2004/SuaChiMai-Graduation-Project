import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaHeadset, FaShoppingBag, FaShieldAlt, FaShippingFast } from 'react-icons/fa';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useFetch } from '../hooks/useFetch';
import { money } from '../utils/format';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(null);
  const [tab, setTab] = useState('description');
  const { data, loading } = useFetch(() => api.get(`/products/slug/${slug}`), [slug]);
  const reviews = useFetch(() => data?.product ? api.get(`/reviews/product/${data.product.id}`) : Promise.resolve({ data: [] }), [data?.product?.id]);

  useEffect(() => {
    setQty(1);
    setActiveImg(null);
    setTab('description');
  }, [slug]);

  if (loading && !data) {
    return (
      <section className="section page-shell">
        <Loading />
      </section>
    );
  }

  if (!data?.product) {
    return (
      <section className="section page-shell empty">
        <h2>Không tìm thấy sản phẩm</h2>
      </section>
    );
  }

  const product = data.product;
  const gallery = product.images?.length ? product.images : (product.gallery?.length ? product.gallery : [product.image]);
  const mainImage = activeImg || gallery[0];
  const currentPrice = Number(product.sale_price || product.price);
  const discount = product.sale_price && Number(product.price) > currentPrice
    ? Math.round((1 - currentPrice / Number(product.price)) * 100)
    : 0;
  const intro = product.short_description || product.description || 'Sản phẩm chính hãng, được chọn lọc phù hợp cho nhu cầu dinh dưỡng hằng ngày.';
  const stock = Math.max(0, Number(product.stock) || 0);
  const outOfStock = stock <= 0;
  const specs = [
    ['Độ tuổi', product.age_range || 'Đang cập nhật'],
    ['Xuất xứ', product.origin || 'Đang cập nhật'],
    ['Quy cách', product.weight || 'Đang cập nhật']
  ];

  const buyNow = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <section className={`section product-detail-page page-shell${loading ? ' is-refreshing' : ''}`}>
      <div className="product-detail-shell">
        <nav className="product-breadcrumb" aria-label="Đường dẫn">
          <button type="button" onClick={() => navigate('/')}>Trang chủ</button>
          <span>/</span>
          <button type="button" onClick={() => navigate('/products')}>Sản phẩm</button>
          <span>/</span>
          <strong>{product.name}</strong>
        </nav>

        <div className="detail-layout">
          <div className="detail-image">
          <div className="detail-main">
            <img src={imageUrl(mainImage)} alt={product.name} />
            {discount > 0 && <span className="detail-discount-badge">-{discount}%</span>}
          </div>
            {gallery.length > 1 && (
              <div className="detail-thumbs">
                {gallery.map((img, index) => (
                  <button key={index} type="button" className={`thumb ${img === mainImage ? 'active' : ''}`} onClick={() => setActiveImg(img)}>
                    <img src={imageUrl(img)} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-info-top">
              <div className="detail-meta-line">
                <span>{product.brand_name || 'Sữa Chi Mai'}</span>
                <span className={outOfStock ? 'stock-pill is-out' : 'stock-pill'}>{outOfStock ? 'Hết hàng' : `Còn hàng · ${stock} sản phẩm`}</span>
              </div>
              <h1>{product.name}</h1>
              <p className="detail-summary">{intro}</p>
            </div>

            <div className="detail-price-panel">
              <div className="detail-price-block">
                <div className="detail-price">
                  {money(currentPrice)}
                  {product.sale_price && <del>{money(product.price)}</del>}
                </div>
                {discount > 0 && <span className="detail-saving">Tiết kiệm {money(Number(product.price) - currentPrice)}</span>}
              </div>

              <div className="spec-grid">
                {specs.map(([label, value]) => (
                  <div key={label}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>
            </div>

            <div className="detail-action-panel">
              <div className="buy-row">
                {outOfStock ? (
                  <div className="sold-out-banner">
                    <strong>Hiện sản phẩm đang hết hàng</strong>
                    <span>Liên hệ cửa hàng để được tư vấn sản phẩm thay thế phù hợp.</span>
                  </div>
                ) : (
                  <>
                  <div className="quantity-label">Số lượng</div>
                  <div className="qty-control">
                    <button className="icon-btn" type="button" aria-label="Giảm số lượng" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                    <input type="number" min="1" max={stock} value={qty} onChange={(event) => setQty(Math.min(stock, Math.max(1, Number(event.target.value) || 1)))} />
                    <button className="icon-btn" type="button" aria-label="Tăng số lượng" onClick={() => setQty((value) => Math.min(stock, value + 1))}>+</button>
                  </div>
                  <div className="detail-actions">
                    <button className="btn primary" type="button" onClick={() => addToCart(product, qty)}><FaShoppingBag /> Thêm vào giỏ</button>
                    <button className="btn accent" type="button" onClick={buyNow}>Mua ngay</button>
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-support-grid">
          <section className="detail-assurance-card">
            <div className="detail-support-heading">
              <span>An tâm mua sắm</span>
              <small>Dịch vụ tại Sữa Chi Mai</small>
            </div>
            <div className="detail-assurances">
              <div><FaShieldAlt /><span><strong>Sản phẩm chính hãng</strong><small>Nguồn gốc rõ ràng</small></span></div>
              <div><FaShippingFast /><span><strong>Giao hàng nhanh</strong><small>Nội khu Đại Lộc</small></span></div>
              <div><FaHeadset /><span><strong>Hỗ trợ mỗi ngày</strong><small>7:00 – 22:00</small></span></div>
            </div>
          </section>
        </div>

        <div className="detail-content-layout">
          <div className="tabs-panel">
            <div className="detail-tabs">
              <button className={tab === 'description' ? 'active' : ''} onClick={() => setTab('description')}>Mô tả sản phẩm</button>
              <button className={tab === 'ingredients' ? 'active' : ''} onClick={() => setTab('ingredients')}>Thành phần &amp; công dụng</button>
              <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Đánh giá ({reviews.data?.length || 0})</button>
            </div>

            <div className="detail-tab-content">
              {tab === 'description' && (
                <div>
                  <h2>Thông tin về {product.name}</h2>
                  <p>{product.description || intro}</p>
                  {product.usage_instructions && <><h3>Hướng dẫn sử dụng</h3><p>{product.usage_instructions}</p></>}
                </div>
              )}

              {tab === 'ingredients' && (
                <div>
                  <h2>Thành phần &amp; công dụng</h2>
                  {product.ingredients && <><h3>Thành phần</h3><p>{product.ingredients}</p></>}
                  {product.benefits && <><h3>Công dụng</h3><p>{product.benefits}</p></>}
                  {!product.ingredients && !product.benefits && <p>Thông tin thành phần đang được cập nhật.</p>}
                </div>
              )}

              {tab === 'reviews' && (
                <div>
                  <h2>Đánh giá sản phẩm</h2>
                  {reviews.data?.length ? reviews.data.map((review) => (
                    <div className="review" key={review.id}>
                      <b>{review.full_name}</b>
                      <div className="small muted">{review.rating}/5</div>
                      <p>{review.comment}</p>
                    </div>
                  )) : <div className="detail-empty-review">Chưa có đánh giá cho sản phẩm này.</div>}
                </div>
              )}
            </div>
          </div>

          <aside className="detail-highlights">
            <span className="badge-soft">Thông tin nhanh</span>
            <h2>Điểm nổi bật</h2>
            <ul>
              <li><FaCheckCircle /><span>Hàng chính hãng, nguồn gốc rõ ràng</span></li>
              <li><FaCheckCircle /><span>Phù hợp: <strong>{product.age_range || 'đang cập nhật'}</strong></span></li>
              <li><FaCheckCircle /><span>Quy cách: <strong>{product.weight || 'đang cập nhật'}</strong></span></li>
              {product.benefits && <li><FaCheckCircle /><span>{product.benefits}</span></li>}
            </ul>
            <button className="btn ghost" type="button" onClick={() => navigate('/contact')}><FaHeadset /> Cần tư vấn thêm</button>
          </aside>
        </div>

        {!!data.related?.length && (
          <section className="detail-related">
            <div className="section-title related-title">
              <div><span className="section-kicker">Có thể bạn quan tâm</span><h2>Sản phẩm liên quan</h2></div>
              <button className="btn ghost" type="button" onClick={() => navigate('/products')}>Xem tất cả</button>
            </div>
            <div className="product-grid">{data.related.map((item) => <ProductCard product={item} key={item.id} />)}</div>
          </section>
        )}
      </div>
    </section>
  );
}
