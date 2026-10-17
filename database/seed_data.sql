USE milk_store;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE contacts;
TRUNCATE TABLE reviews;
TRUNCATE TABLE order_details;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Password for all sample accounts: 123456
INSERT INTO users(full_name,email,phone,password,role,status,address) VALUES
('Admin Milk Store','admin@gmail.com','0900000000','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','admin',1,'Milk Store HQ'),
('Nguyễn Minh Anh','minhanh@gmail.com','0901000001','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Quận 1, TP.HCM'),
('Trần Gia Hân','giahan@gmail.com','0901000002','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Quận 3, TP.HCM'),
('Lê Bảo Nam','baonam@gmail.com','0901000003','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Thủ Đức, TP.HCM'),
('Phạm Thu Trang','thutrang@gmail.com','0901000004','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Gò Vấp, TP.HCM'),
('Võ Quang Huy','quanghuy@gmail.com','0901000005','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Bình Thạnh, TP.HCM');

INSERT INTO categories(name,slug,description,image,status) VALUES
('Sữa bột trẻ em','sua-bot-tre-em','Sữa công thức cho bé theo từng độ tuổi','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',1),
('Sữa tươi','sua-tuoi','Sữa tươi thanh trùng và tiệt trùng','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',1),
('Sữa hạt','sua-hat','Sữa hạt dinh dưỡng từ hạnh nhân, óc chó, đậu nành','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',1),
('Sữa bầu','sua-bau','Dinh dưỡng cho mẹ bầu và sau sinh','https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',1),
('Sữa chua','sua-chua','Sữa chua ăn và sữa chua uống','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',1),
('Phô mai và dinh dưỡng','pho-mai-dinh-duong','Phô mai, bột ăn dặm và sản phẩm bổ sung','https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80',1);

INSERT INTO brands(name,slug,description,logo,status) VALUES
('Vinamilk','vinamilk','Thương hiệu sữa Việt Nam quen thuộc','/uploads/brand-vinamilk.png',1),
('Nutifood','nutifood','Dinh dưỡng chuyên biệt cho gia đình Việt','/uploads/brand-nutifood.png',1),
('TH true MILK','th-true-milk','Sữa tươi sạch từ trang trại','/uploads/brand-th.png',1),
('Abbott','abbott','Thương hiệu dinh dưỡng quốc tế','/uploads/brand-abbott.png',1),
('Meiji','meiji','Sữa công thức và dinh dưỡng Nhật Bản','/uploads/brand-meiji.png',1),
('Friso','friso','Sữa bột nhập khẩu cho trẻ em','/uploads/brand-friso.png',1);

INSERT INTO products(category_id,brand_id,name,slug,image,price,sale_price,stock,age_range,origin,weight,ingredients,benefits,usage_instructions,short_description,description,status,is_featured) VALUES
(1,4,'Abbott Grow Gold 900g','abbott-grow-gold-900g','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',420000,395000,34,'3-6 tuổi','Hoa Kỳ','900g','DHA, canxi, vitamin D','Hỗ trợ chiều cao và trí não','Pha theo hướng dẫn trên hộp','Sữa bột tăng trưởng cho bé','Công thức cân bằng cho trẻ mẫu giáo.',1,1),
(1,5,'Meiji Hohoemi 800g','meiji-hohoemi-800g','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',515000,499000,22,'0-12 tháng','Nhật Bản','800g','DHA, ARA, nucleotides','Hỗ trợ tiêu hóa và miễn dịch','Pha với nước ấm 70C','Sữa bột Nhật cho trẻ sơ sinh','Hương vị thanh nhẹ, dễ uống.',1,1),
(1,6,'Friso Gold Pro 850g','friso-gold-pro-850g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',560000,535000,18,'1-3 tuổi','Hà Lan','850g','HMO, GOS, DHA','Hỗ trợ đề kháng','Dùng muỗng định lượng kèm hộp','Sữa bột nhập khẩu Hà Lan','Dinh dưỡng cho hệ tiêu hóa khỏe.',1,1),
(1,2,'Nutifood GrowPLUS+ 900g','nutifood-growplus-900g','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',385000,355000,40,'1-10 tuổi','Việt Nam','900g','Lysin, kẽm, canxi','Hỗ trợ tăng cân','Pha đúng tỷ lệ','Sữa cho trẻ cần tăng cân','Phù hợp trẻ biếng ăn, thấp còi.',1,0),
(2,1,'Vinamilk 100% Organic 1L','vinamilk-organic-1l','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',52000,NULL,100,'Mọi lứa tuổi','Việt Nam','1L','Sữa tươi hữu cơ','Bổ sung canxi','Uống trực tiếp sau khi mở hộp','Sữa tươi hữu cơ','Vị sữa tươi thanh mát, an toàn.',1,1),
(2,3,'TH true MILK Ít Đường 1L','th-true-milk-it-duong-1l','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',48000,45000,90,'Mọi lứa tuổi','Việt Nam','1L','Sữa tươi, vitamin','Phù hợp chế độ ít đường','Bảo quản lạnh sau mở nắp','Sữa tươi ít đường','Lựa chọn nhẹ bụng cho mọi ngày.',1,0),
(2,1,'Vinamilk Green Farm 180ml','vinamilk-green-farm-180ml','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',8900,NULL,300,'Mọi lứa tuổi','Việt Nam','180ml','Sữa tươi','Tiện lợi mang theo','Lắc đều trước khi uống','Hộp sữa nhỏ tiện lợi','Phù hợp học sinh và văn phòng.',1,0),
(2,3,'TH true MILK Chocolate 180ml','th-true-milk-chocolate-180ml','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',9500,NULL,220,'Mọi lứa tuổi','Việt Nam','180ml','Sữa tươi, cacao','Bổ sung năng lượng','Uống ngon hơn khi lạnh','Sữa tươi vị socola','Hương cacao thơm, dễ uống.',1,0),
(3,1,'Vinamilk Sữa Đậu Nành Óc Chó 180ml','vinamilk-sua-dau-nanh-oc-cho','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',10500,NULL,180,'Người lớn','Việt Nam','180ml','Đậu nành, óc chó','Tốt cho tim mạch','Uống trực tiếp','Sữa hạt tiện lợi','Dinh dưỡng thực vật mỗi ngày.',1,1),
(3,2,'NutiFood Sữa Hạt Hạnh Nhân 1L','nutifood-sua-hat-hanh-nhan-1l','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',69000,62000,55,'Người lớn','Việt Nam','1L','Hạnh nhân, đậu nành','Bổ sung vitamin E','Bảo quản lạnh sau mở nắp','Sữa hạt hạnh nhân','Vị béo nhẹ, ít ngọt.',1,0),
(3,3,'TH true NUT Óc Chó 180ml','th-true-nut-oc-cho-180ml','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',12000,NULL,140,'Người lớn','Việt Nam','180ml','Óc chó, mac ca','Giàu omega','Uống trực tiếp','Sữa hạt đóng hộp','Năng lượng thực vật tiện lợi.',1,0),
(4,4,'Similac Mom 900g','similac-mom-900g','https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',465000,445000,28,'Mẹ bầu','Singapore','900g','DHA, folate, canxi','Hỗ trợ mẹ và bé','Uống 2 ly mỗi ngày','Sữa bầu Abbott','Dinh dưỡng khoa học cho thai kỳ.',1,1),
(4,1,'Vinamilk Optimum Mama 400g','vinamilk-optimum-mama-400g','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',205000,189000,36,'Mẹ bầu','Việt Nam','400g','DHA, sắt, axit folic','Hỗ trợ sức khỏe thai kỳ','Pha với nước ấm','Sữa bầu giá tốt','Hộp nhỏ dễ dùng thử.',1,0),
(4,2,'Nuti IQ Mum Gold 900g','nuti-iq-mum-gold-900g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',398000,NULL,24,'Mẹ bầu','Việt Nam','900g','DHA, choline, prebiotic','Hỗ trợ tiêu hóa','Dùng sau bữa ăn','Sữa cho mẹ bầu','Vị vani nhẹ, dễ uống.',1,0),
(5,1,'Vinamilk Sữa Chua Uống Probi 130ml','vinamilk-probi-130ml','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',8500,NULL,260,'Mọi lứa tuổi','Việt Nam','130ml','Men sống probiotic','Hỗ trợ tiêu hóa','Uống lạnh ngon hơn','Sữa chua uống men sống','Hộp nhỏ tiện lợi mỗi ngày.',1,1),
(5,3,'TH true Yogurt Việt Quất','th-true-yogurt-viet-quat','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',33000,29900,80,'Mọi lứa tuổi','Việt Nam','4 hộp','Sữa chua, việt quất','Bổ sung lợi khuẩn','Bảo quản lạnh','Sữa chua ăn vị trái cây','Vị việt quất tươi mát.',1,0),
(5,1,'Vinamilk Susu IQ 110ml','vinamilk-susu-iq-110ml','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',7200,NULL,280,'Trẻ em','Việt Nam','110ml','Sữa chua uống, vitamin','Hỗ trợ trẻ năng động','Uống trực tiếp','Sữa chua uống cho bé','Hương dâu thơm ngon.',1,0),
(6,5,'Meiji Step Cube 448g','meiji-step-cube-448g','https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80',365000,349000,30,'1-3 tuổi','Nhật Bản','448g','DHA, canxi','Tiện lợi khi đi chơi','Mỗi viên pha theo định lượng','Sữa viên tiện lợi','Đóng gói dạng viên dễ cân đo.',1,1),
(6,1,'Vinamilk Pedia Kenji 850g','vinamilk-pedia-kenji-850g','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',449000,419000,20,'2-10 tuổi','Việt Nam','850g','Đạm whey, MCT, vitamin','Hỗ trợ phục hồi dinh dưỡng','Pha 5 muỗng với 180ml nước','Dinh dưỡng cho trẻ biếng ăn','Công thức năng lượng cao.',1,0),
(6,6,'Friso Gold Pedia 900g','friso-gold-pedia-900g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',610000,579000,16,'2-10 tuổi','Hà Lan','900g','Synbiotics, DHA','Hỗ trợ tăng trưởng','Dùng 2-3 ly mỗi ngày','Sữa pedia cao cấp','Cho trẻ cần bổ sung dinh dưỡng.',1,0);

INSERT INTO orders(user_id,customer_name,phone,address,note,total_amount,payment_method,payment_status,order_status,created_at) VALUES
(2,'Nguyễn Minh Anh','0901000001','Quận 1, TP.HCM','Giao giờ hành chính',844000,'COD','UNPAID','PENDING',NOW()),
(3,'Trần Gia Hân','0901000002','Quận 3, TP.HCM','Gọi trước khi giao',1014000,'BANK_TRANSFER','PAID','COMPLETED',DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4,'Lê Bảo Nam','0901000003','Thủ Đức, TP.HCM',NULL,142000,'COD','UNPAID','CONFIRMED',DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO order_details(order_id,product_id,product_name,price,quantity,total_price) VALUES
(1,1,'Abbott Grow Gold 900g',395000,2,790000),(1,7,'Vinamilk Green Farm 180ml',8900,6,53400),
(2,2,'Meiji Hohoemi 800g',499000,1,499000),(2,3,'Friso Gold Pro 850g',535000,1,535000),
(3,10,'NutiFood Sữa Hạt Hạnh Nhân 1L',62000,2,124000),(3,8,'TH true MILK Chocolate 180ml',9500,2,19000);

INSERT INTO reviews(user_id,product_id,rating,comment,status) VALUES
(3,2,5,'Sữa thơm nhẹ, bé uống hợp và tiêu hóa tốt.',1),
(3,3,4,'Đóng gói chắc chắn, giao nhanh.',1),
(2,1,5,'Giá tốt, sản phẩm mới.',1),
(4,10,4,'Sữa hạt ít ngọt, dễ uống.',1);
