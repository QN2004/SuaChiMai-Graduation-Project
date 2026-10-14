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
('Nguyen Minh Anh','minhanh@gmail.com','0901000001','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Quan 1, TP.HCM'),
('Tran Gia Han','giahan@gmail.com','0901000002','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Quan 3, TP.HCM'),
('Le Bao Nam','baonam@gmail.com','0901000003','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Thu Duc, TP.HCM'),
('Pham Thu Trang','thutrang@gmail.com','0901000004','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Go Vap, TP.HCM'),
('Vo Quang Huy','quanghuy@gmail.com','0901000005','$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza','user',1,'Binh Thanh, TP.HCM');

INSERT INTO categories(name,slug,description,image,status) VALUES
('Sua bot tre em','sua-bot-tre-em','Sua cong thuc cho be theo tung do tuoi','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',1),
('Sua tuoi','sua-tuoi','Sua tuoi thanh trung va tiet trung','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',1),
('Sua hat','sua-hat','Sua hat dinh duong tu hanh nhan, oc cho, dau nanh','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',1),
('Sua bau','sua-bau','Dinh duong cho me bau va sau sinh','https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',1),
('Sua chua','sua-chua','Sua chua an va sua chua uong','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',1),
('Pho mai va dinh duong','pho-mai-dinh-duong','Pho mai, bot an dam va san pham bo sung','https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80',1);

INSERT INTO brands(name,slug,description,logo,status) VALUES
('Vinamilk','vinamilk','Thuong hieu sua Viet Nam quen thuoc','/uploads/brand-vinamilk.png',1),
('Nutifood','nutifood','Dinh duong chuyen biet cho gia dinh Viet','/uploads/brand-nutifood.png',1),
('TH true MILK','th-true-milk','Sua tuoi sach tu trang trai','/uploads/brand-th.png',1),
('Abbott','abbott','Thuong hieu dinh duong quoc te','/uploads/brand-abbott.png',1),
('Meiji','meiji','Sua cong thuc va dinh duong Nhat Ban','/uploads/brand-meiji.png',1),
('Friso','friso','Sua bot nhap khau cho tre em','/uploads/brand-friso.png',1);

INSERT INTO products(category_id,brand_id,name,slug,image,price,sale_price,stock,age_range,origin,weight,ingredients,benefits,usage_instructions,short_description,description,status,is_featured) VALUES
(1,4,'Abbott Grow Gold 900g','abbott-grow-gold-900g','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',420000,395000,34,'3-6 tuoi','Hoa Ky','900g','DHA, canxi, vitamin D','Ho tro chieu cao va tri nao','Pha theo huong dan tren hop','Sua bot tang truong cho be','Cong thuc can bang cho tre mau giao.',1,1),
(1,5,'Meiji Hohoemi 800g','meiji-hohoemi-800g','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',515000,499000,22,'0-12 thang','Nhat Ban','800g','DHA, ARA, nucleotides','Ho tro tieu hoa va mien dich','Pha voi nuoc am 70C','Sua bot Nhat cho tre so sinh','Huong vi thanh nhe, de uong.',1,1),
(1,6,'Friso Gold Pro 850g','friso-gold-pro-850g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',560000,535000,18,'1-3 tuoi','Ha Lan','850g','HMO, GOS, DHA','Ho tro de khang','Dung muong dinh luong kem hop','Sua bot nhap khau Ha Lan','Dinh duong cho he tieu hoa khoe.',1,1),
(1,2,'Nutifood GrowPLUS+ 900g','nutifood-growplus-900g','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',385000,355000,40,'1-10 tuoi','Viet Nam','900g','Lysin, kem, canxi','Ho tro tang can','Pha dung ty le','Sua cho tre can tang can','Phu hop tre bieng an, thap coi.',1,0),
(2,1,'Vinamilk 100% Organic 1L','vinamilk-organic-1l','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',52000,NULL,100,'Moi lua tuoi','Viet Nam','1L','Sua tuoi huu co','Bo sung canxi','Uong truc tiep sau khi mo hop','Sua tuoi huu co','Vi sua tuoi thanh mat, an toan.',1,1),
(2,3,'TH true MILK It Duong 1L','th-true-milk-it-duong-1l','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',48000,45000,90,'Moi lua tuoi','Viet Nam','1L','Sua tuoi, vitamin','Phu hop che do it duong','Bao quan lanh sau mo nap','Sua tuoi it duong','Lua chon nhe bung cho moi ngay.',1,0),
(2,1,'Vinamilk Green Farm 180ml','vinamilk-green-farm-180ml','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',8900,NULL,300,'Moi lua tuoi','Viet Nam','180ml','Sua tuoi','Tien loi mang theo','Lac deu truoc khi uong','Hop sua nho tien loi','Phu hop hoc sinh va van phong.',1,0),
(2,3,'TH true MILK Chocolate 180ml','th-true-milk-chocolate-180ml','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',9500,NULL,220,'Moi lua tuoi','Viet Nam','180ml','Sua tuoi, cacao','Bo sung nang luong','Uong ngon hon khi lanh','Sua tuoi vi socola','Huong cacao thom, de uong.',1,0),
(3,1,'Vinamilk Sua Dau Nanh Oc Cho 180ml','vinamilk-sua-dau-nanh-oc-cho','https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',10500,NULL,180,'Nguoi lon','Viet Nam','180ml','Dau nanh, oc cho','Tot cho tim mach','Uong truc tiep','Sua hat tien loi','Dinh duong thuc vat moi ngay.',1,1),
(3,2,'NutiFood Sua Hat Hanh Nhan 1L','nutifood-sua-hat-hanh-nhan-1l','https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',69000,62000,55,'Nguoi lon','Viet Nam','1L','Hanh nhan, dau nanh','Bo sung vitamin E','Bao quan lanh sau mo nap','Sua hat hanh nhan','Vi beo nhe, it ngot.',1,0),
(3,3,'TH true NUT Oc Cho 180ml','th-true-nut-oc-cho-180ml','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',12000,NULL,140,'Nguoi lon','Viet Nam','180ml','Oc cho, mac ca','Giau omega','Uong truc tiep','Sua hat dong hop','Nang luong thuc vat tien loi.',1,0),
(4,4,'Similac Mom 900g','similac-mom-900g','https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',465000,445000,28,'Me bau','Singapore','900g','DHA, folate, canxi','Ho tro me va be','Uong 2 ly moi ngay','Sua bau Abbott','Dinh duong khoa hoc cho thai ky.',1,1),
(4,1,'Vinamilk Optimum Mama 400g','vinamilk-optimum-mama-400g','https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80',205000,189000,36,'Me bau','Viet Nam','400g','DHA, sat, axit folic','Ho tro suc khoe thai ky','Pha voi nuoc am','Sua bau gia tot','Hop nho de dung thu.',1,0),
(4,2,'Nuti IQ Mum Gold 900g','nuti-iq-mum-gold-900g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',398000,NULL,24,'Me bau','Viet Nam','900g','DHA, choline, prebiotic','Ho tro tieu hoa','Dung sau bua an','Sua cho me bau','Vi vani nhe, de uong.',1,0),
(5,1,'Vinamilk Sua Chua Uong Probi 130ml','vinamilk-probi-130ml','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',8500,NULL,260,'Moi lua tuoi','Viet Nam','130ml','Men song probiotic','Ho tro tieu hoa','Uong lanh ngon hon','Sua chua uong men song','Hop nho tien loi moi ngay.',1,1),
(5,3,'TH true Yogurt Viet Quat','th-true-yogurt-viet-quat','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',33000,29900,80,'Moi lua tuoi','Viet Nam','4 hop','Sua chua, viet quat','Bo sung loi khuan','Bao quan lanh','Sua chua an vi trai cay','Vi viet quat tuoi mat.',1,0),
(5,1,'Vinamilk Susu IQ 110ml','vinamilk-susu-iq-110ml','https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',7200,NULL,280,'Tre em','Viet Nam','110ml','Sua chua uong, vitamin','Ho tro tre nang dong','Uong truc tiep','Sua chua uong cho be','Huong dau thom ngon.',1,0),
(6,5,'Meiji Step Cube 448g','meiji-step-cube-448g','https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80',365000,349000,30,'1-3 tuoi','Nhat Ban','448g','DHA, canxi','Tien loi khi di choi','Moi vien pha theo dinh luong','Sua vien tien loi','Dong goi dang vien de can do.',1,1),
(6,1,'Vinamilk Pedia Kenji 850g','vinamilk-pedia-kenji-850g','https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80',449000,419000,20,'2-10 tuoi','Viet Nam','850g','Dam whey, MCT, vitamin','Ho tro phuc hoi dinh duong','Pha 5 muong voi 180ml nuoc','Dinh duong cho tre bieng an','Cong thuc nang luong cao.',1,0),
(6,6,'Friso Gold Pedia 900g','friso-gold-pedia-900g','https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80',610000,579000,16,'2-10 tuoi','Ha Lan','900g','Synbiotics, DHA','Ho tro tang truong','Dung 2-3 ly moi ngay','Sua pedia cao cap','Cho tre can bo sung dinh duong.',1,0);

INSERT INTO orders(user_id,customer_name,phone,address,note,total_amount,payment_method,payment_status,order_status,created_at) VALUES
(2,'Nguyen Minh Anh','0901000001','Quan 1, TP.HCM','Giao gio hanh chinh',844000,'COD','UNPAID','PENDING',NOW()),
(3,'Tran Gia Han','0901000002','Quan 3, TP.HCM','Goi truoc khi giao',1014000,'BANK_TRANSFER','PAID','COMPLETED',DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4,'Le Bao Nam','0901000003','Thu Duc, TP.HCM',NULL,142000,'COD','UNPAID','CONFIRMED',DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO order_details(order_id,product_id,product_name,price,quantity,total_price) VALUES
(1,1,'Abbott Grow Gold 900g',395000,2,790000),(1,7,'Vinamilk Green Farm 180ml',8900,6,53400),
(2,2,'Meiji Hohoemi 800g',499000,1,499000),(2,3,'Friso Gold Pro 850g',535000,1,535000),
(3,10,'NutiFood Sua Hat Hanh Nhan 1L',62000,2,124000),(3,8,'TH true MILK Chocolate 180ml',9500,2,19000);

INSERT INTO reviews(user_id,product_id,rating,comment,status) VALUES
(3,2,5,'Sua thom nhe, be uong hop va tieu hoa tot.',1),
(3,3,4,'Dong goi chac chan, giao nhanh.',1),
(2,1,5,'Gia tot, san pham moi.',1),
(4,10,4,'Sua hat it ngot, de uong.',1);

