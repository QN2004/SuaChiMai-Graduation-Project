import { Link } from 'react-router-dom';
import { FaCartPlus, FaStar } from 'react-icons/fa';
import { imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';

const fallbackImage = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const price = Number(product.sale_price || product.price || 0);
  const original = Number(product.price || 0);
  const hasSale = Boolean(product.sale_price) && original > price;
  const discount = hasSale ? Math.round(((original - price) / original) * 100) : 0;
  const rating = Number(product.average_rating || 0);
  const reviews = Number(product.review_count || 0);

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
        {hasSale && (
          <span className="badge">
            {discount > 0 ? `-${discount}%` : 'Khuyến mãi'}
          </span>
        )}
      </Link>

      <div className="product-body">
        <div className="product-brand">{product.brand_name || 'Sữa Chi Mai'}</div>
        <Link to={`/products/${product.slug}`} className="product-name">{product.name}</Link>

        <div className="product-meta-row">
          {reviews > 0 ? (
            <div className="rating">
              <FaStar />
              <span>{rating.toFixed(1)}</span>
              <em>({reviews})</em>
            </div>
          ) : (
            <div className="rating rating-empty">Chưa có đánh giá</div>
          )}
        </div>

        <div className="price-row">
          <strong>{money(price)}</strong>
          {hasSale && <del>{money(original)}</del>}
        </div>

        <button
          type="button"
          aria-label={`Thêm ${product.name} vào giỏ`}
          className="btn primary full product-cart-btn"
          onClick={() => addToCart(product, 1)}
        >
          <FaCartPlus />
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
