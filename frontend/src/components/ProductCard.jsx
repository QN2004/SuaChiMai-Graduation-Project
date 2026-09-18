import { Link } from 'react-router-dom';
import { FaCartPlus, FaStar } from 'react-icons/fa';
import { imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';

const fallbackImage = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const description = product.short_description || product.description || '';

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image">
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        {product.sale_price && <span className="badge">Khuyến mãi</span>}
      </Link>
      <div className="product-body">
        <div className="muted small">{product.brand_name || 'Sữa Chi Mai'}</div>
        <Link to={`/products/${product.slug}`} className="product-name">{product.name}</Link>
        {description && (
          <p className="small muted" style={{ margin: 0 }}>
            {description.slice(0, 100)}{description.length > 100 ? '...' : ''}
          </p>
        )}
        <div className="rating">
          <FaStar /> {Number(product.average_rating || 5).toFixed(1)} <span>({product.review_count || 0})</span>
        </div>
        <div className="price-row">
          <strong>{money(product.sale_price || product.price)}</strong>
          {product.sale_price && <del>{money(product.price)}</del>}
        </div>
        <button
          aria-label={`Thêm ${product.name} vào giỏ`}
          className="btn primary full"
          onClick={() => addToCart(product, 1)}
        >
          <FaCartPlus /> Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
