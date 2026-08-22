-- Sữa Chi Mai - Seed Data
-- Sample products, categories, brands

-- Categories
INSERT INTO categories (name, description, image) VALUES
('Sữa bột cho bé', 'Sữa bột dinh dưỡng cho trẻ em từ 0-3 tuổi', '/uploads/category-baby-formula.jpg'),
('Sữa cho mẹ bầu', 'Sữa bổ sung dinh dưỡng cho phụ nữ mang thai', '/uploads/category-pregnant.jpg'),
('Sữa tươi uống', 'Sữa tươi nguyên chất, giao nhanh', '/uploads/category-fresh-milk.jpg'),
('Sữa chua', 'Sữa chua và yogurt tự nhiên', '/uploads/category-yogurt.jpg'),
('Phô mai', 'Phô mai tự nhiên, dinh dưỡng', '/uploads/category-cheese.jpg'),
('Sữa đặc', 'Sữa đặc có đường và không đường', '/uploads/category-condensed.jpg');

-- Brands
INSERT INTO brands (name, description, logo) VALUES
('Sữa Chi Mai', 'Thương hiệu sữa chính hãng Việt Nam', '/uploads/brand-chimai.jpg'),
('Vinamilk', 'Sữa tươi hàng đầu Việt Nam', '/uploads/brand-vinamilk.jpg'),
('Cô Gái Hà Lan', 'Sữa nhập khẩu từ Hà Lan', '/uploads/brand-hollgirl.jpg'),
('Megamilk', 'Sữa tươi chất lượng cao', '/uploads/brand-megamilk.jpg');

-- Banners
INSERT INTO banners (title, description, image, link, sort_order, active) VALUES
('Mua ngay - Giao nhanh hôm nay', 'Sữa Chi Mai - Chất lượng, Tin cậy, Nhanh chóng', '/uploads/banner-main.jpg', '/products', 1, 1),
('Khuyến mãi lớn - Giảm 30%', 'Tất cả sản phẩm sữa được giảm giá đặc biệt', '/uploads/banner-promo.jpg', '/products?sort=sale', 2, 1);

-- Products - Sữa bột cho bé
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, age_range, weight, origin, ingredients, benefits, usage_instructions, is_featured) VALUES
('Sữa Chi Mai Gold 1 - 400g', 'sua-chi-mai-gold-1-400g', 'Sữa bột cao cấp cho bé từ 0-6 tháng', 'Sữa bột chi mai gold cho bé 0-6 tháng', 189000, 159000, '/uploads/product-chimai-gold1.jpg', 50, 1, 1, '0-6 tháng', '400g', 'Việt Nam', 'Lactic acid, Prebiotics, DHA, AA, Vitamin, Mineral', 'Hỗ trợ miễn dịch, Phát triển não bộ, Tiêu hóa khỏe', 'Trộn 1 thìa cà phê (4.5g) với 25ml nước ấm', 1),
('Sữa Chi Mai Gold 2 - 400g', 'sua-chi-mai-gold-2-400g', 'Sữa bột cao cấp cho bé từ 6-12 tháng', 'Sữa bột chi mai gold cho bé 6-12 tháng', 199000, 169000, '/uploads/product-chimai-gold2.jpg', 45, 1, 1, '6-12 tháng', '400g', 'Việt Nam', 'Lactic acid, Prebiotics, DHA, AA, Vitamin, Mineral, Iron', 'Hỗ trợ miễn dịch, Phát triển não bộ, Tăng sắc tố', 'Trộn 1 thìa cà phê (4.5g) với 30ml nước ấm', 1),
('Sữa Chi Mai Gold 3 - 400g', 'sua-chi-mai-gold-3-400g', 'Sữa bột cao cấp cho bé từ 1-3 tuổi', 'Sữa bột chi mai gold cho bé 1-3 tuổi', 189000, 159000, '/uploads/product-chimai-gold3.jpg', 55, 1, 1, '1-3 tuổi', '400g', 'Việt Nam', 'Lactic acid, Prebiotics, DHA, AA, Vitamin, Mineral, Calcium', 'Hỗ trợ miễn dịch, Phát triển xương răng, Tiêu hóa', 'Trộn 1 thìa cà phê (4.5g) với 35ml nước ấm', 1),
('Sữa Vinamilk 1 - 400g', 'sua-vinamilk-1-400g', 'Sữa Vinamilk cho bé từ 0-6 tháng', 'Sữa bột Vinamilk dành cho bé', 229000, 199000, '/uploads/product-vinamilk1.jpg', 40, 1, 2, '0-6 tháng', '400g', 'Việt Nam', 'Lactic acid, Prebiotics, DHA, Vitamin', 'Phát triển não, Hỗ trợ miễn dịch', 'Trộn 1 thìa cà phê (4.5g) với 25ml nước ấm', 0),
('Sữa Cô Gái Hà Lan 1 - 800g', 'sua-co-gai-ha-lan-1-800g', 'Sữa bột nhập khẩu từ Hà Lan cho bé 0-6 tháng', 'Sữa Hà Lan cao cấp cho bé', 459000, 389000, '/uploads/product-cogiaihalan1.jpg', 30, 1, 3, '0-6 tháng', '800g', 'Hà Lan', 'Whey protein, DHA, Vitamin, Mineral, Probiotic', 'Phát triển toàn diện, Tiêu hóa tốt', 'Trộn 1 thìa (4g) với 25ml nước ấm', 1);

-- Products - Sữa cho mẹ bầu
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, weight, origin, ingredients, benefits, usage_instructions, is_featured) VALUES
('Sữa Chi Mai Mẹ Khoẻ - 400g', 'sua-chi-mai-me-khoe-400g', 'Sữa bột cho mẹ bầu và cho con bú', 'Sữa chi mai mẹ khoẻ cho phụ nữ bầu', 199000, 169000, '/uploads/product-me-khoe.jpg', 35, 2, 1, '400g', 'Việt Nam', 'Calcium, Iron, Folate, DHA, Vitamin D, Mineral', 'Hỗ trợ phát triển thai nhi, Tăng sức đề kháng, Cung cấp năng lượng', 'Trộn 4-5 thìa (30g) với 150ml nước ấm', 1),
('Sữa Megamilk Mẹ - 380g', 'sua-megamilk-me-380g', 'Sữa bột cho mẹ mang thai', 'Sữa Megamilk dành cho phụ nữ bầu', 169000, 149000, '/uploads/product-megamilk-me.jpg', 28, 2, 4, '380g', 'Việt Nam', 'Calcium, DHA, Vitamin, Mineral, Probiotic', 'Tăng cường miễn dịch, Phát triển thai', 'Trộn 4 thìa (30g) với 150ml nước ấm', 0);

-- Products - Sữa tươi uống
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, weight, origin, benefits, usage_instructions) VALUES
('Sữa Chi Mai Tươi 1L - Hộp', 'sua-chi-mai-tuoi-1l-hop', 'Sữa tươi 100% không chứa chất bảo quản', 'Sữa chi mai tươi 1 lít hộp giấy', 45000, 39000, '/uploads/product-fresh-1l.jpg', 100, 3, 1, '1L', 'Việt Nam', 'Giàu Calcium, Vitamin A & D, Chất xơ', 'Uống trực tiếp hoặc dùng trong nấu ăn', 0),
('Sữa Vinamilk Tươi 1L - Hộp', 'sua-vinamilk-tuoi-1l-hop', 'Sữa tươi Vinamilk nguyên chất', 'Sữa vinamilk tươi 1 lít hộp giấy', 48000, 42000, '/uploads/product-vinamilk-fresh.jpg', 80, 3, 2, '1L', 'Việt Nam', 'Giàu Calcium, Vitamin, Mineral', 'Uống trực tiếp lạnh hoặc nấu ăn', 0);

-- Products - Sữa chua & Yogurt
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, weight, origin, benefits, usage_instructions) VALUES
('Sữa Chua Chi Mai Tự Nhiên - 100g x 4', 'sua-chua-chi-mai-tu-nhien-100g-x4', 'Sữa chua tự nhiên không đường, giàu men sống', 'Sữa chua tự nhiên chi mai set 4 hộp', 35000, 29000, '/uploads/product-yogurt-plain.jpg', 60, 4, 1, '400g (4x100g)', 'Việt Nam', 'Men sống, Protein, Lợi khuẩn, Không đường', 'Ăn lạnh từ tủ lạnh, tuyệt vời cho sức khỏe tiêu hóa', 0),
('Sữa Chua Chi Mai Dâu Tây - 100g x 4', 'sua-chua-chi-mai-dau-tay-100g-x4', 'Sữa chua với hương vị dâu tây tự nhiên', 'Sữa chua chi mai dâu tây set 4 hộp', 39000, 32000, '/uploads/product-yogurt-strawberry.jpg', 50, 4, 1, '400g (4x100g)', 'Việt Nam', 'Men sống, Protein, Vitamin C, Lợi khuẩn', 'Ăn lạnh, có thể kết hợp với muesli và hạt', 1);

-- Products - Phô mai
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, weight, origin, benefits, usage_instructions) VALUES
('Phô Mai Chi Mai Mềm - 180g', 'pho-mai-chi-mai-mem-180g', 'Phô mai mềm, dinh dưỡng cao, dễ tiêu hóa', 'Phô mai mềm chi mai 180g', 79000, 69000, '/uploads/product-cheese-soft.jpg', 25, 5, 1, '180g', 'Việt Nam', 'Calcium cao, Protein, Vitamin B12', 'Ăn trực tiếp hoặc dùng làm bánh, mì ống', 0),
('Phô Mai Cô Gái Hà Lan - 200g', 'pho-mai-co-gai-ha-lan-200g', 'Phô mai cứng nhập khẩu từ Hà Lan', 'Phô mai cứng hà lan 200g', 129000, 109000, '/uploads/product-cheese-hard.jpg', 15, 5, 3, '200g', 'Hà Lan', 'Calcium rất cao, Protein, Enzym lợi khuẩn', 'Ăn trực tiếp hoặc grated vào bữa ăn', 0);

-- Products - Sữa đặc
INSERT INTO products (name, slug, description, short_description, price, sale_price, image, stock, category_id, brand_id, weight, origin, benefits, usage_instructions) VALUES
('Sữa Đặc Chi Mai Có Đường - 395g', 'sua-dac-chi-mai-co-duong-395g', 'Sữa đặc có đường, dùng cho làm bánh tráng miệng', 'Sữa đặc chi mai có đường 395g', 25000, 21000, '/uploads/product-condensed-sweet.jpg', 80, 6, 1, '395g', 'Việt Nam', 'Năng lượng cao, Calcium, Vitamin', 'Dùng làm bánh, tráng miệng, pha cà phê', 0),
('Sữa Đặc Chi Mai Không Đường - 395g', 'sua-dac-chi-mai-khong-duong-395g', 'Sữa đặc không đường, phù hợp người tiểu đường', 'Sữa đặc chi mai không đường 395g', 28000, 24000, '/uploads/product-condensed-nosugar.jpg', 70, 6, 1, '395g', 'Việt Nam', 'Calcium, Protein, Ít đường', 'Pha cà phê, dùng nấu ăn, an toàn cho tiểu đường', 1);

-- Admin User
INSERT INTO users (email, password, full_name, phone, role) 
VALUES ('admin@suachimai.vn', '$2a$10$JkGd9k5dCx3ksZ80/7B/V.8l2455M4vD1BE.l/nF75pHX04K4jd4W', 'Admin Chi Mai', '1900 6363', 'admin');

-- Sample News
INSERT INTO news (title, slug, content, image) 
VALUES 
('Cách chọn sữa cho bé sơ sinh', 'cach-chon-sua-cho-be-so-sinh', 'Sữa là nguồn dinh dưỡng thiết yếu cho trẻ sơ sinh. Cha mẹ cần lựa chọn sữa phù hợp với độ tuổi và tình trạng sức khỏe của bé...', '/uploads/news-baby-milk.jpg'),
('Dinh dưỡng cho phụ nữ mang thai', 'dinh-duong-cho-phu-nu-mang-thai', 'Phụ nữ mang thai cần bổ sung đầy đủ dinh dưỡng để đảm bảo sức khỏe cho cả mẹ và bé. Sữa là một trong những thực phẩm tốt nhất...', '/uploads/news-pregnant-nutrition.jpg'),
('Lợi ích của sữa chua cho sức khỏe', 'loi-ich-cua-sua-chua-cho-suc-khoe', 'Sữa chua chứa nhiều lợi khuẩn tốt cho tiêu hóa, giúp tăng cường miễn dịch và cải thiện sức khỏe toàn diện...', '/uploads/news-yogurt-benefits.jpg');

-- Sample Contact
INSERT INTO contacts (full_name, email, phone, message, status) 
VALUES 
('Nguyễn Văn A', 'nguyenvana@gmail.com', '0901234567', 'Xin hỏi về chất lượng sữa Chi Mai', 'new'),
('Trần Thị B', 'tranthib@gmail.com', '0912345678', 'Giao hàng nhanh không?', 'new');
