import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

const rules = [
  {
    patterns: ['giờ', 'mở cửa', 'đóng cửa', 'hoạt động'],
    answer: 'Cửa hàng Sữa Chi Mai mở cửa từ **7:00 đến 22:00**, tất cả các ngày trong tuần kể cả thứ 7 và Chủ nhật!'
  },
  {
    patterns: ['địa chỉ', 'ở đâu', 'địa điểm', 'đại lộc', 'đại nghĩa'],
    answer: 'Cửa hàng tại **Đại Nghĩa, Đại Lộc, Quảng Nam**. Bạn có thể liên hệ hotline để được hướng dẫn đường đi nhé!'
  },
  {
    patterns: ['điện thoại', 'hotline', 'số điện thoại', 'gọi', 'liên hệ', 'contact'],
    answer: 'Hotline hỗ trợ: **0987 654 321**. Hỗ trợ từ 7:00 đến 22:00, tất cả các ngày. Email: suachimai.dailoc@gmail.com'
  },
  {
    patterns: ['giá', 'bao nhiêu', 'chi phí', 'tiền'],
    answer: 'Giá sản phẩm rất đa dạng tuỳ loại sữa và thương hiệu. Bạn vui lòng xem mục **Sản phẩm** để biết giá chi tiết, hoặc gọi hotline 0987 654 321 để được tư vấn!'
  },
  {
    patterns: ['giao hàng', 'ship', 'vận chuyển', 'nhận hàng'],
    answer: 'Hiện tại cửa hàng hỗ trợ **giao hàng nội khu Đại Lộc**. Liên hệ hotline 0987 654 321 để biết thêm chi tiết khu vực giao hàng và phí ship nhé!'
  },
  {
    patterns: ['đổi trả', 'trả hàng', 'hoàn tiền', 'bảo hành'],
    answer: 'Cửa hàng có chính sách **đổi trả minh bạch**. Nếu sản phẩm lỗi hoặc không đúng yêu cầu, bạn liên hệ ngay hotline 0987 654 321 để được hỗ trợ trong 24h!'
  },
  {
    patterns: ['đặt hàng', 'mua', 'order', 'giỏ hàng'],
    answer: 'Bạn có thể **đặt hàng trực tiếp** trên website bằng cách chọn sản phẩm → Thêm vào giỏ → Thanh toán. Hoặc gọi hotline 0987 654 321 để đặt hàng qua điện thoại!'
  },
  {
    patterns: ['thanh toán', 'cod', 'chuyển khoản', 'ngân hàng'],
    answer: 'Cửa hàng hỗ trợ **COD (tiền mặt khi nhận hàng)** và **chuyển khoản ngân hàng**. Thanh toán dễ dàng, an toàn!'
  },
  {
    patterns: ['sản phẩm', 'loại sữa', 'có những gì', 'danh mục', 'thương hiệu'],
    answer: 'Cửa hàng có đầy đủ các loại: **sữa bột, sữa tươi, sữa cho bé, sữa cho mẹ bầu, sữa dinh dưỡng người lớn, sữa organic**… Xem tất cả tại mục Sản phẩm nhé!'
  },
  {
    patterns: ['vinamilk', 'nutifood', 'abbott', 'mead johnson', 'friso', 'nan', 'similac', 'enfamil'],
    answer: 'Cửa hàng phân phối nhiều thương hiệu uy tín như **Vinamilk, Nutifood, Abbott, Mead Johnson, Friso**... Sản phẩm chính hãng, nguồn gốc rõ ràng!'
  },
  {
    patterns: ['bé', 'trẻ em', 'em bé', 'sơ sinh', 'trẻ nhỏ'],
    answer: 'Cửa hàng có nhiều loại sữa phù hợp cho từng giai đoạn của bé: **sơ sinh (0–6 tháng), bú mẹ (6–12 tháng), tập đi (1–3 tuổi), trẻ em (3+)**. Tư vấn chi tiết qua hotline 0987 654 321!'
  },
  {
    patterns: ['mẹ bầu', 'bầu', 'thai kỳ', 'mang thai'],
    answer: 'Cửa hàng có đầy đủ **sữa cho mẹ bầu và cho con bú** từ nhiều thương hiệu uy tín, bổ sung DHA, canxi, acid folic. Gọi tư vấn: 0987 654 321!'
  },
  {
    patterns: ['người lớn', 'cao tuổi', 'người già', 'tiểu đường', 'dinh dưỡng'],
    answer: 'Cửa hàng có **sữa dành cho người lớn, người cao tuổi, người tiểu đường, suy dinh dưỡng**. Đội ngũ tư vấn sẵn sàng giúp bạn chọn đúng sản phẩm!'
  },
  {
    patterns: ['khuyến mãi', 'giảm giá', 'sale', 'ưu đãi', 'chương trình'],
    answer: 'Cập nhật **khuyến mãi và tin tức ưu đãi** tại mục Tin tức trên website, hoặc liên hệ hotline 0987 654 321 để biết chương trình mới nhất!'
  },
  {
    patterns: ['đơn hàng', 'trạng thái', 'theo dõi', 'kiểm tra đơn'],
    answer: 'Bạn có thể theo dõi đơn hàng tại **Tài khoản → Đơn hàng của tôi**. Cần hỗ trợ gấp thì gọi hotline 0987 654 321 nhé!'
  },
  {
    patterns: ['chào', 'hello', 'hi', 'xin chào', 'hey'],
    answer: 'Xin chào! 👋 Tôi là trợ lý tư vấn của **Sữa Chi Mai**. Bạn cần hỗ trợ gì về sản phẩm, đơn hàng hay thông tin cửa hàng? Cứ hỏi nhé!'
  },
  {
    patterns: ['cảm ơn', 'thanks', 'thank you', 'ok', 'được rồi'],
    answer: 'Cảm ơn bạn đã tin tưởng Sữa Chi Mai! 😊 Nếu cần thêm gì, cứ nhắn bất cứ lúc nào. Chúc bạn một ngày tốt lành!'
  }
];

const DEFAULT = 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về: **sản phẩm, giá, giao hàng, giờ mở cửa, địa chỉ, đổi trả** hoặc gọi hotline **0987 654 321** để được tư vấn trực tiếp!';

router.post('/', (req, res) => {
  const text = (req.body.message || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

  for (const rule of rules) {
    if (rule.patterns.some((p) => {
      const norm = p.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
      return text.includes(norm);
    })) {
      return res.json({ success: true, data: { answer: rule.answer } });
    }
  }

  res.json({ success: true, data: { answer: DEFAULT } });
});

export default router;
