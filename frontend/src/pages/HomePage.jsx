import { Link } from 'react-router-dom';
import { FaArrowRight, FaAward, FaCheckCircle, FaHeadset, FaShieldAlt, FaShippingFast } from 'react-icons/fa';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';
import heroFamilyNutrition from '../assets/hero-family-nutrition-v7.png';
import heroFamilyNutritionTablet from '../assets/hero-family-nutrition-tablet-v1.png';
import heroFamilyNutritionMobile from '../assets/hero-family-nutrition-mobile-v1.png';

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
          '--hero-image-desktop': `url(${heroFamilyNutrition})`,
          '--hero-image-tablet': `url(${heroFamilyNutritionTablet})`,
          '--hero-image-mobile': `url(${heroFamilyNutritionMobile})`
        }}
      >
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Sữa Chi Mai - Đại Lộc</span>
            <h1>Chọn đúng sữa,<br /><em>an tâm cho cả nhà</em></h1>
            <p>Sản phẩm chính hãng, nguồn gốc rõ ràng — chọn theo độ tuổi và nhu cầu của bé, mẹ bầu, ba mẹ.</p>
            <div className="hero-actions">
              <Link className="btn primary" to="/products">
                Mua sắm ngay <FaArrowRight />
              </Link>
              <Link className="btn ghost" to="/contact">Nhận tư vấn</Link>
            </div>
            <div className="hero-proof" aria-label="Cam kết dịch vụ">
              <span><FaCheckCircle /> 100% chính hãng</span>
              <span><FaCheckCircle /> Tư vấn tận tâm</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits-section" aria-label="Cam kết dịch vụ">
        <div className="hero-features home-benefits">
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
