import { Link } from 'react-router-dom';
import { FaArrowRight, FaAward, FaHeadset, FaShieldAlt, FaShippingFast } from 'react-icons/fa';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';
import heroMilkFamily from '../assets/hero-milk-family.png';

export default function HomePage() {
  const { data, loading } = useFetch(async () => {
    const [featured, latest, best] = await Promise.all([
      api.get('/products/featured'),
      api.get('/products/latest'),
      api.get('/products/best-selling')
    ]);

    return {
      data: {
        featured: (featured.data || []).slice(0, 4),
        latest: (latest.data || []).slice(0, 4),
        best: (best.data || []).slice(0, 4)
      }
    };
  }, []);

  const pageData = data || { featured: [], latest: [], best: [] };
  const productsReady = !loading && data;

  const features = [
    { icon: <FaShieldAlt />, label: 'Sản phẩm chính hãng', note: 'Nguồn gốc rõ ràng' },
    { icon: <FaShippingFast />, label: 'Giao hàng nhanh', note: 'Nội khu Đại Lộc' },
    { icon: <FaHeadset />, label: 'Hỗ trợ mỗi ngày', note: 'Tư vấn đúng nhu cầu' },
    { icon: <FaAward />, label: 'Đổi trả minh bạch', note: 'Mua sắm yên tâm' }
  ];

  return (
    <div className="home-page">
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255, 255, 255, .92), rgba(255, 255, 255, .38)), url(${heroMilkFamily})`
        }}
      >
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Sữa Chi Mai - Đại Lộc</span>
            <h1>Sữa chính hãng cho từng nhu cầu dinh dưỡng</h1>
            <p>Chọn nhanh sữa bột, sữa tươi và sản phẩm chăm sóc sức khỏe phù hợp cho bé, mẹ bầu và cả gia đình.</p>
            <div className="hero-actions">
              <Link className="btn primary" to="/products">
                Mua sắm ngay <FaArrowRight />
              </Link>
              <Link className="btn ghost" to="/contact">Nhận tư vấn</Link>
            </div>
          </div>
        </div>

        <div className="hero-features">
          {features.map((feature) => (
            <div className="hero-feature-item" key={feature.label}>
              <span className="feature-icon">{feature.icon}</span>
              <div>
                <p>{feature.label}</p>
                <small>{feature.note}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section home-product-section featured-product-section">
        <div className="section-title">
          <div>
            <span className="section-kicker">Sữa Chi Mai gợi ý</span>
            <h2>Sản phẩm nổi bật</h2>
            <p>Những lựa chọn được khách hàng quan tâm nhiều</p>
          </div>
          <Link to="/products">Xem tất cả</Link>
        </div>
        <div className="product-grid home-product-grid featured-product-grid">
          {!productsReady ? (
            <Loading text="Đang tải sản phẩm..." />
          ) : pageData.featured.slice(0, 4).length ? pageData.featured.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product.id} />
          )) : (
            <div className="empty-state">Chưa có sản phẩm để hiển thị.</div>
          )}
        </div>
      </section>
      <ProductSection
        title="Hàng mới về"
        subtitle="Cập nhật nhanh các sản phẩm vừa lên kệ"
        products={pageData.latest}
        ready={productsReady}
      />
      <ProductSection
        title="Bán chạy"
        subtitle="Các sản phẩm quen thuộc trong giỏ hàng gia đình"
        products={pageData.best}
        ready={productsReady}
      />
    </div>
  );
}

function ProductSection({ title, subtitle, products, ready }) {
  const visibleProducts = (products || []).slice(0, 4);

  return (
    <section className="section home-product-section">
      <div className="section-title">
        <div>
          <span className="section-kicker">Sữa Chi Mai gợi ý</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <Link to="/products">Xem tất cả</Link>
      </div>
      <div className="product-grid home-product-grid">
        {!ready ? (
          <Loading text="Đang tải sản phẩm..." />
        ) : visibleProducts.length ? visibleProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        )) : (
          <div className="empty-state">Chưa có sản phẩm để hiển thị.</div>
        )}
      </div>
    </section>
  );
}
