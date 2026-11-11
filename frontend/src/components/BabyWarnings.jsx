import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const tagText = { AGE: 'Độ tuổi', CMPA: 'Đạm sữa bò', LACTOSE: 'Lactose' };

// Hộp cảnh báo an toàn theo hồ sơ bé; không chặn mua, chỉ nhắc phụ huynh.
export default function BabyWarnings({ baby, warnings, compact = false }) {
  if (!baby || !warnings.length) return null;
  return (
    <div className={`baby-warning${compact ? ' compact' : ''}`} role="alert">
      <span className="bw-icon"><FaExclamationTriangle /></span>
      <div className="bw-title">Lưu ý theo hồ sơ bé {baby.name} ({baby.age_text})</div>
      <ul>
        {warnings.map((item) => (
          <li key={item.product_id}>
            {!compact && <b>{item.product_name}</b>}
            <div className="bw-tags">
              {item.warnings.map((w) => (
                <span key={w.type} className={`tone-chip ${w.level === 'danger' ? 'bad' : 'warn'}`}>{tagText[w.type] || w.type}</span>
              ))}
            </div>
            <p>{item.warnings.map((w) => w.message).join(' ')}</p>
          </li>
        ))}
      </ul>
      {!compact && <div className="bw-foot">Chỉ là lời nhắc: bạn vẫn đặt được nếu mua cho người khác. <Link to="/babies">Xem hồ sơ bé</Link></div>}
    </div>
  );
}
