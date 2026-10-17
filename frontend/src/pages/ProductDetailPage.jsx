import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const intro = product.short_description || product.description || 'Sản phẩm chính hãng, được chọn lọc phù hợp cho nhu cầu dinh dưỡng hằng ngày.';
  const specs = [
    ['Độ tuổi', product.age_range || 'Đang cập nhật'],
    ['Xuất xứ', product.origin || 'Đang cập nhật'],
    ['Quy cách', product.weight || 'Đang cập nhật'],
    ['Tồn kho', product.stock ?? 0]
  ];

  const buyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <section className={`section product-detail-page page-shell${loading ? ' is-refreshing' : ''}`}>
      <div className="detail-hero">
        <div>
          <span className="badge-soft">Chi tiết sản phẩm</span>
          <h1>{product.name}</h1>
          <p>{intro}</p>
        </div>
        <div className="detail-hero-card">
          <span>Giá hiện tại</span>
          <strong>{money(currentPrice)}</strong>
          <small>{product.sale_price ? `Giá niêm yết ${money(product.price)}` : 'Giá bán chính hãng'}</small>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-image">
          <div className="detail-main">
            <img src={imageUrl(mainImage)} alt={product.name} />
          </div>
          <div className="detail-thumbs">
            {gallery.map((img, index) => (
              <button key={index} className={`thumb ${img === mainImage ? 'active' : ''}`} onClick={() => setActiveImg(img)}>
                <img src={imageUrl(img)} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span className="badge-soft">{product.category_name} / {product.brand_name}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">
            {money(currentPrice)}
            {product.sale_price && <del>{money(product.price)}</del>}
          </div>
          <p>{intro}</p>

          <div className="spec-grid">
            {specs.map(([label, value]) => (
              <span key={label}>{label}: <b>{value}</b></span>
            ))}
          </div>

          <div className="buy-row">
            <div className="qty-control">
              <button className="icon-btn" type="button" onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
              <input type="number" min="1" max={product.stock} value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} />
              <button className="icon-btn" type="button" onClick={() => setQty((value) => Math.min(product.stock, value + 1))}>+</button>
            </div>
            <div className="detail-actions">
              <button className="btn primary" disabled={product.stock <= 0} onClick={() => addToCart(product, qty)}>Thêm vào giỏ</button>
              <button className="btn accent" disabled={product.stock <= 0} onClick={buyNow}>Mua ngay</button>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-intro">
        <div className="detail-intro-copy">
          <span className="badge-soft">Tổng quan</span>
          <h2>{product.name}</h2>
          <p>{intro}</p>
          {product.benefits && <p><b>Lợi ích:</b> {product.benefits}</p>}
        </div>
        <div className="detail-intro-box">
          <h3>Điểm nổi bật</h3>
          <ul>
            <li>Hàng chính hãng, nguồn gốc rõ ràng</li>
            <li>Phù hợp: {product.age_range || 'đang cập nhật'}</li>
            <li>Quy cách: {product.weight || 'đang cập nhật'}</li>
            <li>Còn {product.stock ?? 0} sản phẩm trong kho</li>
          </ul>
        </div>
      </div>

      <div className="tabs-panel">
        <div className="detail-tabs">
          <button className={`btn ${tab === 'description' ? 'primary' : 'ghost'}`} onClick={() => setTab('description')}>Mô tả</button>
          <button className={`btn ${tab === 'ingredients' ? 'primary' : 'ghost'}`} onClick={() => setTab('ingredients')}>Thành phần</button>
          <button className={`btn ${tab === 'reviews' ? 'primary' : 'ghost'}`} onClick={() => setTab('reviews')}>Đánh giá ({reviews.data?.length || 0})</button>
        </div>

        {tab === 'description' && (
          <div>
            <h3>Thông tin chi tiết</h3>
            <p>{product.description || intro}</p>
            {product.usage_instructions && <p><b>Hướng dẫn sử dụng:</b> {product.usage_instructions}</p>}
          </div>
        )}

        {tab === 'ingredients' && (
          <div>
            <h3>Thành phần & công dụng</h3>
            {product.ingredients && <p><b>Thành phần:</b> {product.ingredients}</p>}
            {product.benefits && <p><b>Công dụng:</b> {product.benefits}</p>}
            {!product.ingredients && !product.benefits && <p>Thông tin thành phần đang được cập nhật.</p>}
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <h3>Đánh giá sản phẩm</h3>
            {reviews.data?.length ? reviews.data.map((review) => (
              <div className="review" key={review.id}>
                <b>{review.full_name}</b>
                <div className="small muted">{review.rating}/5</div>
                <p>{review.comment}</p>
              </div>
            )) : <p>Chưa có đánh giá.</p>}
          </div>
        )}
      </div>

      <div className="section-title related-title">
        <h2>Sản phẩm liên quan</h2>
      </div>
      <div className="product-grid">{data.related.map((item) => <ProductCard product={item} key={item.id} />)}</div>
    </section>
  );
}
