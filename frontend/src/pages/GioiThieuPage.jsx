import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheck,
  FaHeadset,
  FaHeart,
  FaShieldAlt,
  FaStore,
  FaTruck,
} from 'react-icons/fa';
import consultationHero from '../assets/about/consultation-1440.webp';
import consultationHero960 from '../assets/about/consultation-960.webp';
import consultationHero640 from '../assets/about/consultation-640.webp';
import orderCare from '../assets/about/order-care-1200.webp';
import orderCare800 from '../assets/about/order-care-800.webp';
import orderCare560 from '../assets/about/order-care-560.webp';
import useDocumentMeta from '../hooks/useDocumentMeta';

const commitments = [
  {
    icon: FaHeadset,
    title: 'Hiểu nhu cầu trước khi tư vấn',
    text: 'Mỗi lựa chọn bắt đầu từ độ tuổi, thói quen và mục tiêu dinh dưỡng của người sử dụng.',
  },
  {
    icon: FaShieldAlt,
    title: 'Thông tin rõ ràng, dễ kiểm tra',
    text: 'Nguồn gốc, đối tượng sử dụng và hướng dẫn dùng được trình bày minh bạch trước khi mua.',
  },
  {
    icon: FaTruck,
    title: 'Chuẩn bị đơn hàng cẩn thận',
    text: 'Sản phẩm được kiểm tra, đóng gói gọn gàng và giao theo thông tin khách hàng cung cấp.',
  },
];

const journey = [
  {
    step: '01',
    title: 'Chia sẻ nhu cầu',
    text: 'Cho chúng tôi biết người dùng, độ tuổi và điều bạn đang quan tâm.',
  },
  {
    step: '02',
    title: 'So sánh phù hợp',
    text: 'Nhận gợi ý ngắn gọn, dễ hiểu giữa những lựa chọn phù hợp nhất.',
  },
  {
    step: '03',
    title: 'An tâm nhận hàng',
    text: 'Xác nhận sản phẩm, kiểm tra đơn và nhận hàng được đóng gói cẩn thận.',
  },
];

export default function GioiThieuPage() {
  useDocumentMeta({
    title: 'Giới thiệu Sữa Chi Mai | Tư vấn dinh dưỡng tận tâm',
  });

  return (
    <div className="about-page">
      <div className="about-shell">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-copy">
            <span className="about-kicker"><FaStore /> Câu chuyện Sữa Chi Mai</span>
            <h1 id="about-title">Chọn đúng dinh dưỡng, an tâm cho cả nhà</h1>
            <p>
              Sữa Chi Mai giúp việc chọn sữa và sản phẩm dinh dưỡng trở nên đơn giản hơn bằng
              thông tin rõ ràng, tư vấn theo nhu cầu và trải nghiệm mua sắm gần gũi.
            </p>

            <div className="about-actions">
              <Link className="btn primary about-primary-action" to="/products">
                Khám phá sản phẩm <FaArrowRight />
              </Link>
              <Link className="about-text-link" to="/contact">
                Nhận tư vấn <FaArrowRight />
              </Link>
            </div>

            <div className="about-proof-row" aria-label="Cam kết nổi bật">
              <span><FaCheck /> Nguồn gốc rõ ràng</span>
              <span><FaCheck /> Tư vấn theo nhu cầu</span>
              <span><FaCheck /> Hỗ trợ mỗi ngày</span>
            </div>
          </div>

          <div className="about-hero-media">
            <picture>
              <source
                srcSet={`${consultationHero640} 640w, ${consultationHero960} 960w, ${consultationHero} 1440w`}
                sizes="(max-width: 900px) 100vw, 52vw"
              />
              <img
                src={consultationHero}
                alt="Nhân viên Sữa Chi Mai tư vấn sản phẩm dinh dưỡng cho mẹ và bé"
                width="1440"
                height="901"
                fetchPriority="high"
              />
            </picture>
            <div className="about-media-note">
              <span><FaHeart /></span>
              <div>
                <strong>Gần gũi như người nhà</strong>
                <small>Lắng nghe trước, tư vấn sau</small>
              </div>
            </div>
          </div>
        </section>

        <section className="about-commitments" aria-labelledby="commitment-title">
          <div className="about-section-heading">
            <span className="about-kicker">Điều chúng tôi theo đuổi</span>
            <h2 id="commitment-title">Một trải nghiệm mua sữa nhẹ nhàng và đáng tin cậy</h2>
            <p>Không cần quá nhiều lựa chọn. Điều quan trọng là lựa chọn phù hợp và dễ hiểu.</p>
          </div>

          <div className="about-commitment-grid">
            {commitments.map(({ icon: Icon, title, text }) => (
              <article className="about-commitment-card" key={title}>
                <span className="about-card-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-journey" aria-labelledby="journey-title">
          <div className="about-journey-media">
            <picture>
              <source
                srcSet={`${orderCare560} 560w, ${orderCare800} 800w, ${orderCare} 1200w`}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
              <img
                src={orderCare}
                alt="Đơn hàng sản phẩm dinh dưỡng được đóng gói cẩn thận"
                width="1200"
                height="800"
                loading="lazy"
              />
            </picture>
            <div className="about-image-caption">
              <FaShieldAlt /> Kiểm tra sản phẩm trước khi đóng gói
            </div>
          </div>

          <div className="about-journey-copy">
            <span className="about-kicker">Hành trình phục vụ</span>
            <h2 id="journey-title">Từ câu hỏi đầu tiên đến khi đơn hàng tới tay bạn</h2>
            <p className="about-journey-lead">
              Quy trình được rút gọn để bạn dễ quyết định, nhưng vẫn có đủ thông tin cần thiết
              ở từng bước.
            </p>

            <div className="about-steps">
              {journey.map((item) => (
                <article className="about-step" key={item.step}>
                  <span>{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta" aria-label="Liên hệ Sữa Chi Mai">
          <div>
            <span className="about-kicker about-kicker-light">Sữa Chi Mai đồng hành cùng bạn</span>
            <h2>Bạn chưa biết sản phẩm nào phù hợp?</h2>
            <p>Hãy chia sẻ nhu cầu, chúng tôi sẽ giúp bạn thu hẹp lựa chọn.</p>
          </div>
          <div className="about-cta-actions">
            <Link className="btn about-cta-button" to="/contact">Liên hệ tư vấn</Link>
            <Link className="about-cta-link" to="/products">Xem tất cả sản phẩm <FaArrowRight /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
