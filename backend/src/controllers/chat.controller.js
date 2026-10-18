import { query as dbQuery } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import {
  getOrderIdsFromAnswer,
  getProductIdsFromAnswer,
  isComparisonRequest,
  isProductRequest,
  normalizeChatText,
  selectOrdersByIds,
  stripOrderMetadata,
  stripProductMetadata
} from '../utils/chatIntent.js';
import { getSuggestedQuestions, sendChatMessage } from '../services/dify.service.js';
import { getMyOrders } from '../services/order.service.js';

const cleanAssistantAnswer = (value) => {
  let answer = stripOrderMetadata(stripProductMetadata(value))
    .replace(/<｜end▁of▁sentence｜>/g, '')
    .replace(/^\s*(?:Câu trả lời|Trả lời|Final answer)\s*:\s*/i, '')
    .trim();

  const labelledAnswer = answer.match(/\n\s*(?:Câu trả lời|Trả lời)\s*:\s*/i);
  if (labelledAnswer?.index !== undefined) {
    answer = answer.slice(labelledAnswer.index + labelledAnswer[0].length).trim();
  }

  const greeting = answer.match(/(?:^|\n)\s*(Chào\s+(?:bạn|anh|chị|em|cô|chú|quý khách)\b)/i);
  const leading = greeting?.index ? answer.slice(0, greeting.index) : '';
  const leakedInstruction = /(có yêu cầu|nếu khách|hỏi thêm|cần hỏi|yêu cầu tư vấn|thông tin cần thu thập)/i.test(leading);
  if (greeting?.index !== undefined && greeting.index > 0 && leakedInstruction) {
    answer = answer.slice(greeting.index).trim();
  }

  return answer;
};

const getProductContent = async (question, answer) => {
  if (!isProductRequest(question, answer)) return { products: [], comparison: null };
  const requestedProductIds = getProductIdsFromAnswer(answer);
  const products = await dbQuery(`
    SELECT p.id, p.name, p.slug, p.image, p.price, p.sale_price, p.stock,
      p.age_range, p.origin, p.weight, p.ingredients, p.benefits,
      c.name AS category_name, b.name AS brand_name
    FROM products p
    LEFT JOIN categories c ON c.id=p.category_id
    LEFT JOIN brands b ON b.id=p.brand_id
    WHERE p.status=1
    ORDER BY p.is_featured DESC, p.id DESC
    LIMIT 80
  `);
  const haystack = normalizeChatText(`${question} ${answer}`);
  const mentionedProducts = products
    .map((product) => {
      const name = normalizeChatText(product.name);
      return { product, position: name.length >= 4 ? haystack.indexOf(name) : -1 };
    })
    .filter((item) => item.position >= 0)
    .sort((left, right) => left.position - right.position)
    .map((item) => item.product);
  const productsById = new Map(products.map((product) => [Number(product.id), product]));
  const productsFromMetadata = requestedProductIds
    .map((id) => productsById.get(id))
    .filter(Boolean);
  const visible = (productsFromMetadata.length ? productsFromMetadata : mentionedProducts)
    .slice(0, isComparisonRequest(question) ? 4 : 6);
  return {
    products: visible,
    comparison: isComparisonRequest(question) && visible.length >= 2
      ? { products: visible.slice(0, 4) }
      : null
  };
};

const getOrderContent = async (answer, accessToken) => {
  const requestedIds = getOrderIdsFromAnswer(answer);
  if (!requestedIds.length || !accessToken) return [];
  const orders = await getMyOrders(accessToken);
  return selectOrdersByIds(orders, requestedIds);
};

export const chat = async (req, res) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message && !req.file) return fail(res, 422, 'Vui lòng nhập câu hỏi hoặc chọn một ảnh');

    const bearer = String(req.headers.authorization || '');
    const accessToken = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const clientSession = String(req.body.session_id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    const difyUser = req.user?.id ? `customer-${req.user.id}` : `guest-${clientSession || 'web'}`;
    const dify = await sendChatMessage({
      query: message || 'Hãy tìm sản phẩm tương tự với hình ảnh này.',
      conversationId: req.body.conversation_id,
      user: difyUser,
      accessToken,
      file: req.file
    });

    const [productContent, orders, suggestions] = await Promise.all([
      getProductContent(message, dify.answer || '').catch(() => ({ products: [], comparison: null })),
      getOrderContent(dify.answer || '', accessToken).catch((error) => {
        console.error('Order cards error:', error.message);
        return [];
      }),
      getSuggestedQuestions({ messageId: dify.message_id, user: difyUser })
    ]);

    return ok(res, 'Thành công', {
      message_id: dify.message_id,
      conversation_id: dify.conversation_id,
      answer: cleanAssistantAnswer(dify.answer),
      suggestions,
      rich_content: {
        products: productContent.products,
        orders,
        comparison: productContent.comparison
      }
    });
  } catch (error) {
    console.error('Dify chat error:', error.details || error);
    return fail(res, error.status >= 400 && error.status < 600 ? error.status : 502, error.message || 'Không thể kết nối trợ lý AI');
  }
};
