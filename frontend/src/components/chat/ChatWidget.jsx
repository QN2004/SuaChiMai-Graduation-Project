import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaCompressAlt,
  FaExpandAlt,
  FaExternalLinkAlt,
  FaImage,
  FaPaperPlane,
  FaPaperclip,
  FaShoppingCart,
  FaTimes,
  FaTrash
} from 'react-icons/fa';
import api, { imageUrl } from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useUiFeedback } from '../../context/UiFeedbackContext';
import { money, orderCode, paymentStatusText, statusText, statusTone } from '../../utils/format';
import mascot from '../../assets/suachimai-chatbot.png';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Xin chào! 👋 Mình là Mai — trợ lý mua sắm của Sữa Chi Mai. Mình có thể tư vấn sản phẩm, so sánh giá và dinh dưỡng, hướng dẫn sử dụng hoặc kiểm tra đơn hàng cho bạn.',
  rich: null
};

const starterSuggestions = [
  'Tư vấn sữa phù hợp cho bé',
  'So sánh các sản phẩm',
  'Xem đơn hàng của tôi',
  'Chính sách giao hàng'
];

const makeSessionId = () => {
  const existing = sessionStorage.getItem('suachimai_chat_session');
  if (existing) return existing;
  const next = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem('suachimai_chat_session', next);
  return next;
};

const textParts = (text) => String(text || '')
  .split(/(\*\*[^*]+\*\*|~~[^~]+~~)/g)
  .map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return <del key={`${part}-${index}`}>{part.slice(2, -2)}</del>;
    }
    return part;
  });

function ProductResultCard({ product }) {
  const { addToCart } = useCart();
  const { toast } = useUiFeedback();
  const price = Number(product.sale_price || product.price || 0);
  const soldOut = Number(product.stock) <= 0;

  const add = () => {
    addToCart(product, 1);
    toast(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <article className="chat-product-card">
      <Link to={`/products/${product.slug}`} className="chat-product-image">
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
      </Link>
      <div className="chat-product-info">
        <small>{product.brand_name || 'Sữa Chi Mai'}</small>
        <Link to={`/products/${product.slug}`}>{product.name}</Link>
        <strong>{money(price)}</strong>
        <div className="chat-product-actions">
          <Link to={`/products/${product.slug}`} className="chat-mini-action">
            Chi tiết <FaExternalLinkAlt />
          </Link>
          <button type="button" className="chat-mini-action primary" disabled={soldOut} onClick={add}>
            <FaShoppingCart /> {soldOut ? 'Hết hàng' : 'Thêm giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductComparison({ products }) {
  const { addToCart } = useCart();
  const { toast } = useUiFeedback();
  if (!products?.length) return null;
  const prices = products
    .map((product) => Number(product.sale_price || product.price || 0))
    .filter((price) => price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : null;
  const rows = [
    { key: 'price', label: 'Giá bán', value: (item) => money(item.sale_price || item.price) },
    { key: 'age', label: 'Độ tuổi', value: (item) => item.age_range || '—' },
    { key: 'origin', label: 'Xuất xứ', value: (item) => item.origin || '—' },
    { key: 'weight', label: 'Khối lượng', value: (item) => item.weight || '—' },
    { key: 'stock', label: 'Tồn kho', value: (item) => Number(item.stock) > 0 ? `Còn ${item.stock}` : 'Hết hàng' }
  ];
  return (
    <div className="chat-compare-wrap">
      <div className="chat-rich-title">Bảng so sánh nhanh</div>
      <div className="chat-compare-scroll" role="region" aria-label="Bảng so sánh sản phẩm" tabIndex="0">
        <table className="chat-compare-table">
          <thead>
            <tr>
              <th className="chat-compare-criterion">Tiêu chí</th>
              {products.map((product, index) => (
                <th className={`chat-compare-product-head tone-${index % 4}`} key={product.id}>
                  <small>{product.brand_name || `Sản phẩm ${index + 1}`}</small>
                  <span>{product.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th className="chat-compare-criterion">{row.label}</th>
                {products.map((product, index) => {
                  const price = Number(product.sale_price || product.price || 0);
                  const isBestPrice = row.key === 'price' && lowestPrice !== null && price === lowestPrice;
                  const inStock = Number(product.stock) > 0;
                  return (
                    <td
                      className={`chat-compare-value tone-${index % 4}${isBestPrice ? ' is-best-price' : ''}`}
                      key={product.id}
                    >
                      {row.key === 'price' ? (
                        <div className="chat-compare-price">
                          <strong>{row.value(product)}</strong>
                          {isBestPrice && <small>Giá tốt nhất</small>}
                        </div>
                      ) : row.key === 'stock' ? (
                        <span className={`chat-compare-stock ${inStock ? 'is-available' : 'is-sold-out'}`}>
                          {row.value(product)}
                        </span>
                      ) : row.value(product)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th className="chat-compare-criterion">Thao tác</th>
              {products.map((product, index) => (
                <td className={`chat-compare-value tone-${index % 4}`} key={product.id}>
                  <div className="chat-compare-actions">
                    <Link to={`/products/${product.slug}`}>Chi tiết</Link>
                    <button
                      type="button"
                      disabled={Number(product.stock) <= 0}
                      onClick={() => {
                        addToCart(product, 1);
                        toast(`Đã thêm ${product.name} vào giỏ hàng`);
                      }}
                    >
                      <FaShoppingCart /> {Number(product.stock) <= 0 ? 'Hết hàng' : 'Thêm giỏ'}
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="chat-compare-hint">Kéo ngang để xem thêm sản phẩm →</div>
    </div>
  );
}

function OrderResultCard({ order }) {
  return (
    <article className="chat-order-card">
      <div className="chat-order-head">
        <span><FaBoxOpen /> #{orderCode(order)}</span>
        <span className={`status-chip compact ${statusTone(order.order_status)}`}>
          {statusText[order.order_status] || order.order_status}
        </span>
      </div>
      <div className="chat-order-meta">
        <span>{order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : '—'}</span>
        <span>{Number(order.item_qty || order.item_count || 0)} sản phẩm</span>
        <span>{paymentStatusText[order.payment_status] || order.payment_status}</span>
      </div>
      <div className="chat-order-foot">
        <strong>{money(order.total_amount)}</strong>
        <Link to={`/my-orders/${order.id}`}>Xem chi tiết <FaExternalLinkAlt /></Link>
      </div>
    </article>
  );
}

function RichContent({ rich }) {
  const products = rich?.products || [];
  const orders = rich?.orders || [];
  return (
    <>
      {rich?.comparison?.products?.length > 1 && <ProductComparison products={rich.comparison.products} />}
      {products.length > 0 && !rich?.comparison && (
        <div className="chat-rich-section">
          <div className="chat-rich-title">Sản phẩm tìm thấy</div>
          <div className="chat-product-list">
            {products.map((product) => <ProductResultCard product={product} key={product.id} />)}
          </div>
        </div>
      )}
      {orders.length > 0 && (
        <div className="chat-rich-section">
          <div className="chat-rich-title">Đơn hàng của bạn</div>
          <div className="chat-order-list">
            {orders.map((order) => <OrderResultCard order={order} key={order.id} />)}
          </div>
        </div>
      )}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [suggestions, setSuggestions] = useState(starterSuggestions);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const windowRef = useRef(null);
  const sessionId = useRef(makeSessionId());

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }
    const next = URL.createObjectURL(file);
    setPreviewUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (!open) return undefined;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!coarse) inputRef.current?.focus();
    if (!coarse || window.innerWidth > 600) return undefined;

    const frame = windowRef.current;
    const viewport = window.visualViewport;
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow
    };

    const place = () => {
      if (!frame) return;
      const height = viewport?.height || window.innerHeight;
      frame.style.top = '0px';
      frame.style.left = '0px';
      frame.style.right = 'auto';
      frame.style.bottom = 'auto';
      frame.style.transform = 'none';
      frame.style.width = '100%';
      frame.style.height = `${height}px`;
      if (window.scrollY !== 0 || root.scrollTop !== 0) window.scrollTo(0, 0);
    };

    const keepInputVisible = (event) => {
      if (frame?.contains(event.target)) return;
      event.preventDefault();
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    place();
    viewport?.addEventListener('resize', place);
    viewport?.addEventListener('scroll', place);
    window.addEventListener('scroll', place);
    document.addEventListener('touchmove', keepInputVisible, { passive: false });

    return () => {
      viewport?.removeEventListener('resize', place);
      viewport?.removeEventListener('scroll', place);
      window.removeEventListener('scroll', place);
      document.removeEventListener('touchmove', keepInputVisible);
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      if (frame) {
        frame.style.top = '';
        frame.style.left = '';
        frame.style.right = '';
        frame.style.bottom = '';
        frame.style.transform = '';
        frame.style.width = '';
        frame.style.height = '';
      }
    };
  }, [open]);

  const send = async (message = input) => {
    const clean = String(message || '').trim();
    if ((!clean && !file) || sending) return;
    const outgoing = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: clean || 'Tìm sản phẩm tương tự trong ảnh này',
      image: previewUrl
    };
    setMessages((current) => [...current, outgoing]);
    setInput('');
    setSuggestions([]);
    setSending(true);

    const form = new FormData();
    form.append('message', clean);
    form.append('session_id', sessionId.current);
    if (conversationId) form.append('conversation_id', conversationId);
    if (file) form.append('file', file);
    setFile(null);

    try {
      const response = await api.post('/chat/messages', form);
      const data = response.data;
      setConversationId(data.conversation_id || conversationId);
      setMessages((current) => [...current, {
        id: data.message_id || `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'Mình chưa tìm thấy câu trả lời phù hợp. Bạn thử mô tả rõ hơn nhé.',
        rich: data.rich_content
      }]);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      setMessages((current) => [...current, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ ${error.message || 'Mình chưa thể kết nối hệ thống. Bạn vui lòng thử lại sau.'}`
      }]);
    } finally {
      setSending(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    send();
  };

  return (
    <div className={`chatbot-root${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="chatbot-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Thu nhỏ trợ lý Sữa Chi Mai' : 'Mở trợ lý Sữa Chi Mai'}
        aria-expanded={open}
      >
        <img src={mascot} alt="" />
        <span className="chatbot-badge">Hỏi Mai</span>
      </button>

      {open && (
        <section ref={windowRef} className={`chatbot-window${expanded ? ' is-expanded' : ''}`} aria-label="Trợ lý mua sắm Sữa Chi Mai">
          <header className="chatbot-header">
            <span className="chatbot-avatar"><img src={mascot} alt="" /></span>
            <div>
              <strong>Mai · Trợ lý Sữa Chi Mai</strong>
              <small><i /> Trực tuyến · Phản hồi bằng AI</small>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setExpanded((value) => !value)}
              aria-label={expanded ? 'Thu nhỏ cửa sổ chat' : 'Mở rộng cửa sổ chat'}
            >
              {expanded ? <FaCompressAlt /> : <FaExpandAlt />}
            </button>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Đóng cửa sổ chat">
              <FaTimes />
            </button>
          </header>

          <div className="chatbot-body" ref={bodyRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`chatbot-msg chatbot-msg--${message.role === 'user' ? 'user' : 'bot'}${message.rich ? ' has-rich' : ''}`} key={message.id}>
                {message.role === 'assistant' && <span className="chatbot-msg-avatar"><img src={mascot} alt="" /></span>}
                <div className="chatbot-message-content">
                  <div className={`chatbot-bubble${message.rich ? ' chatbot-bubble--rich' : ''}`}>
                    <div className="chatbot-answer-text">
                      {message.image && <img className="chat-message-image" src={message.image} alt="Ảnh đã gửi" />}
                      <p>{textParts(message.text)}</p>
                    </div>
                    {message.rich && <RichContent rich={message.rich} />}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="chatbot-msg chatbot-msg--bot">
                <span className="chatbot-msg-avatar"><img src={mascot} alt="" /></span>
                <div className="chatbot-bubble chatbot-typing" aria-label="Mai đang trả lời">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="chatbot-quick" aria-label="Câu hỏi gợi ý">
              {suggestions.map((suggestion) => (
                <button type="button" className="chatbot-chip" key={suggestion} onClick={() => send(suggestion)} disabled={sending}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {file && (
            <div className="chat-file-preview">
              <img src={previewUrl} alt="Ảnh chuẩn bị gửi" />
              <span><FaImage /> {file.name}</span>
              <button type="button" onClick={() => setFile(null)} aria-label="Bỏ ảnh"><FaTrash /></button>
            </div>
          )}

          <form className="chatbot-footer" onSubmit={submit}>
            <label className="chat-attach" title="Gửi ảnh sản phẩm">
              <FaPaperclip />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
            <textarea
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Hỏi về sản phẩm, giá, đơn hàng..."
              aria-label="Nhập câu hỏi"
              onFocus={() => {
                if (!window.matchMedia('(pointer: coarse)').matches) return;
                const reset = () => window.scrollTo(0, 0);
                reset();
                requestAnimationFrame(reset);
                window.setTimeout(reset, 60);
                window.setTimeout(reset, 280);
              }}
            />
            <button type="submit" disabled={sending || (!input.trim() && !file)} aria-label="Gửi câu hỏi">
              <FaPaperPlane />
            </button>
          </form>
          <div className="chatbot-disclaimer">AI có thể chưa hoàn hảo · Kiểm tra thông tin quan trọng trước khi mua</div>
        </section>
      )}
    </div>
  );
}
