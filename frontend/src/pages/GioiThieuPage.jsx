import { Link } from 'react-router-dom';

const highlights = [
  'Sữa chính hãng cho bé, mẹ bầu và gia đình',
  'Giao nhanh trong ngày tại TP.HCM',
  'Tư vấn chọn sản phẩm phù hợp theo nhu cầu',
];

const stats = [
  { value: '200+', label: 'Sản phẩm dinh dưỡng' },
  { value: '24h', label: 'Hỗ trợ đặt hàng' },
  { value: '100%', label: 'Hàng chính hãng' },
];

const pillars = [
  {
    title: 'Tư vấn đúng nhu cầu',
    text: 'Chúng tôi hỗ trợ chọn sữa theo độ tuổi, thể trạng và mục tiêu sử dụng để bạn mua đúng ngay từ đầu.',
  },
  {
    title: 'Nguồn gốc rõ ràng',
    text: 'Ưu tiên sản phẩm chính hãng, thông tin minh bạch, hạn sử dụng và mô tả được kiểm tra kỹ trước khi bán.',
  },
  {
    title: 'Giao hàng nhanh',
    text: 'Xử lý đơn nhanh, giao trong ngày tại TP.HCM khi có thể, giúp khách hàng yên tâm cần là có.',
  },
];

const journey = [
  { step: '01', title: 'Chọn nhu cầu', text: 'Bạn xác định đối tượng sử dụng và mục tiêu dinh dưỡng.' },
  { step: '02', title: 'Được tư vấn', text: 'Nhân viên gợi ý dòng sản phẩm phù hợp và dễ dùng nhất.' },
  { step: '03', title: 'Nhận hàng', text: 'Đóng gói cẩn thận, giao nhanh tận nơi theo yêu cầu.' },
];

const makeStoreImage = (accent, secondary) => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fffdfb" />
      <stop offset="100%" stop-color="${secondary}" />
    </linearGradient>
    <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f5f7fb" />
    </linearGradient>
  </defs>
  <rect width="1400" height="900" rx="56" fill="url(#bg)" />
  <rect x="92" y="92" width="1216" height="716" rx="42" fill="#ffffff" opacity="0.82" />
  <rect x="150" y="175" width="1100" height="24" rx="12" fill="${accent}" />
  <rect x="150" y="405" width="1100" height="24" rx="12" fill="${accent}" opacity="0.72" />
  <rect x="150" y="635" width="1100" height="24" rx="12" fill="${accent}" opacity="0.55" />
  <g opacity="0.98">
    <rect x="190" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="205" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="215" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
    <rect x="360" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="375" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="385" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
    <rect x="530" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="545" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="555" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
    <rect x="700" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="715" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="725" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
    <rect x="870" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="885" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="895" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
    <rect x="1040" y="220" width="130" height="165" rx="24" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="1055" y="190" width="100" height="44" rx="18" fill="${accent}" />
    <rect x="1065" y="250" width="80" height="88" rx="16" fill="#fff4f7" />
  </g>
  <g opacity="0.98">
    <rect x="225" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="238" y="425" width="82" height="36" rx="14" fill="${accent}" />
    <rect x="392" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="405" y="425" width="82" height="36" rx="14" fill="${accent}" />
    <rect x="559" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="572" y="425" width="82" height="36" rx="14" fill="${accent}" />
    <rect x="726" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="739" y="425" width="82" height="36" rx="14" fill="${accent}" />
    <rect x="893" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="906" y="425" width="82" height="36" rx="14" fill="${accent}" />
    <rect x="1060" y="450" width="108" height="148" rx="20" fill="url(#glass)" stroke="#e7edf1" />
    <rect x="1073" y="425" width="82" height="36" rx="14" fill="${accent}" />
  </g>
  <rect x="160" y="730" width="1080" height="28" rx="14" fill="${accent}" opacity="0.24" />
  <circle cx="1188" cy="154" r="72" fill="${accent}" opacity="0.12" />
</svg>
`)}`;

const gallery = [
  makeStoreImage('#d6336c', '#fff2f6'),
  makeStoreImage('#f0b429', '#fff9ea'),
  makeStoreImage('#2f9ea6', '#eefbfc'),
];

export default function GioiThieuPage() {
  return (
    <div className="section">
      <div className="store-page-shell">
        <section className="store-hero-card">
          <div className="store-hero-copy">
            <span className="store-eyebrow">Giới thiệu cửa hàng</span>
            <h1>Sữa Chi Mai - chọn đúng sản phẩm, chăm đúng nhu cầu</h1>
            <p className="store-lead">
              Chúng tôi tập trung vào các dòng sữa và dinh dưỡng chính hãng cho bé, mẹ bầu và gia đình,
              kèm tư vấn nhanh để bạn chọn đúng sản phẩm theo độ tuổi, thể trạng và mục tiêu sử dụng.
            </p>

            <div className="store-highlight-list">
              {highlights.map((item) => (
                <div className="store-highlight-item" key={item}>
                  <span />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="store-stat-grid">
              {stats.map((stat) => (
                <div className="store-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="store-actions">
              <Link className="btn primary" to="/products">Khám phá sản phẩm</Link>
              <Link className="btn ghost" to="/contact">Liên hệ tư vấn</Link>
            </div>
          </div>

          <div className="store-hero-visual">
            <div className="visual-main">
              <img src={gallery[0]} alt="Cửa hàng Sữa Chi Mai" />
              <div className="visual-badge">Tươi ngon mỗi ngày</div>
            </div>
            <div className="visual-mini-grid">
              <img src={gallery[1]} alt="Sản phẩm sữa chính hãng" />
              <img src={gallery[2]} alt="Sản phẩm dinh dưỡng nổi bật" />
            </div>
            <div className="visual-note">
              <strong>Không gian mua sắm thân thiện</strong>
              <span>Kệ hàng rõ ràng, sản phẩm trưng bày gọn gàng và dễ chọn theo từng nhu cầu.</span>
            </div>
          </div>
        </section>

        <section className="store-section">
          <div className="section-title store-section-title">
            <h2>Vì sao khách hàng chọn Sữa Chi Mai</h2>
          </div>
          <div className="store-pillars-grid">
            {pillars.map((pillar) => (
              <article className="store-pillar-card" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="store-section store-story-section">
          <div className="store-story-copy">
            <span className="store-eyebrow">Hành trình phục vụ</span>
            <h2>Gọn gàng từ khâu chọn sản phẩm đến lúc giao hàng</h2>
            <p>
              Chúng tôi xây dựng quy trình mua sắm đơn giản: xem sản phẩm, được tư vấn nhanh, đặt hàng và
              nhận hàng trong thời gian ngắn nhất có thể. Mục tiêu là giúp việc mua sữa không còn rối.
            </p>
          </div>
          <div className="store-journey-grid">
            {journey.map((item) => (
              <div className="journey-card" key={item.step}>
                <span>{item.step}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}