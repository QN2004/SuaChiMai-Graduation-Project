-- Database backup for milk_store
-- Generated at 2026-06-12T06:43:31.852Z
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;
CREATE DATABASE IF NOT EXISTS `milk_store` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `milk_store`;

DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `banners` (`id`, `title`, `image`, `link`, `status`, `created_at`, `updated_at`) VALUES (1, 'Dinh duong moi ngay cho ca gia dinh', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1600&q=80', '/products', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `banners` (`id`, `title`, `image`, `link`, `status`, `created_at`, `updated_at`) VALUES (2, 'Uu dai sua bot cho be', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1600&q=80', '/products?category=1', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `banners` (`id`, `title`, `image`, `link`, `status`, `created_at`, `updated_at`) VALUES (3, 'Sua hat thanh nhe', 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=1600&q=80', '/products?category=3', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');

DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) DEFAULT NULL,
  `description` text,
  `logo` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (1, 'Vinamilk', 'vinamilk', 'Thuong hieu sua Viet Nam quen thuoc', '/uploads/brand-vinamilk.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (2, 'Nutifood', 'nutifood', 'Dinh duong chuyen biet cho gia dinh Viet', '/uploads/brand-nutifood.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (3, 'TH true MILK', 'th-true-milk', 'Sua tuoi sach tu trang trai', '/uploads/brand-th.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (4, 'Abbott', 'abbott', 'Thuong hieu dinh duong quoc te', '/uploads/brand-abbott.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (5, 'Meiji', 'meiji', 'Sua cong thuc va dinh duong Nhat Ban', '/uploads/brand-meiji.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`) VALUES (6, 'Friso', 'friso', 'Sua bot nhap khau cho tre em', '/uploads/brand-friso.png', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (1, 'Sua bot tre em', 'sua-bot-tre-em', 'Sua cong thuc cho be theo tung do tuoi', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (2, 'Sua tuoi', 'sua-tuoi', 'Sua tuoi thanh trung va tiet trung', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (3, 'Sua hat', 'sua-hat', 'Sua hat dinh duong tu hanh nhan, oc cho, dau nanh', 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (4, 'Sua bau', 'sua-bau', 'Dinh duong cho me bau va sau sinh', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (5, 'Sua chua', 'sua-chua', 'Sua chua an va sua chua uong', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `created_at`, `updated_at`) VALUES (6, 'Pho mai va dinh duong', 'pho-mai-dinh-duong', 'Pho mai, bot an dam va san pham bo sung', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text,
  `status` enum('new','read','replied') DEFAULT 'new',
  `reply_message` text,
  `replied_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `contacts` (`id`, `full_name`, `email`, `phone`, `message`, `status`, `reply_message`, `replied_at`, `created_at`) VALUES (1, 'Khach Test', 'khach.test@example.com', '0901111222', 'Can tu van sua cho be 2 tuoi', 'replied', 'Cua hang se goi lai de tu van san pham phu hop.', '2026-06-12 13:13:23', '2026-06-12 13:13:23');

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `slug` varchar(220) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `content` text,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `news` (`id`, `title`, `slug`, `image`, `content`, `status`, `created_at`, `updated_at`) VALUES (1, 'Bi quyet chon sua bot phu hop cho be', 'bi-quyet-chon-sua-bot-phu-hop-cho-be', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1200&q=80', 'Hay chon sua theo do tuoi, tinh trang dinh duong va kha nang tieu hoa cua be. Khi doi sua nen theo doi phan ung trong vai ngay dau.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `news` (`id`, `title`, `slug`, `image`, `content`, `status`, `created_at`, `updated_at`) VALUES (2, 'Khuyen mai mua 2 tang 1 cho dong sua tuoi', 'khuyen-mai-mua-2-tang-1-sua-tuoi', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80', 'Chuong trinh ap dung cho nhieu san pham sua tuoi trong tuan nay. So luong qua tang co han.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `news` (`id`, `title`, `slug`, `image`, `content`, `status`, `created_at`, `updated_at`) VALUES (3, 'Sua hat co phu hop de uong moi ngay?', 'sua-hat-co-phu-hop-de-uong-moi-ngay', 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=1200&q=80', 'Sua hat la lua chon tien loi de bo sung dinh duong thuc vat. Nen doc thanh phan duong va dam de phu hop nhu cau.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_details_order` (`order_id`),
  KEY `fk_order_details_product` (`product_id`),
  CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (1, 1, 1, 'Abbott Grow Gold 900g', '395000.00', 2, '790000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (2, 1, 7, 'Vinamilk Green Farm 180ml', '8900.00', 6, '53400.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (3, 2, 2, 'Meiji Hohoemi 800g', '499000.00', 1, '499000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (4, 2, 3, 'Friso Gold Pro 850g', '535000.00', 1, '535000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (5, 3, 10, 'NutiFood Sua Hat Hanh Nhan 1L', '62000.00', 2, '124000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (6, 3, 8, 'TH true MILK Chocolate 180ml', '9500.00', 2, '19000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (7, 4, 1, 'Abbott Grow Gold 900g', '395000.00', 1, '395000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (8, 5, 6, 'TH true MILK It Duong 1L', '45000.00', 1, '45000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (9, 5, 5, 'Vinamilk 100% Organic 1L', '52000.00', 1, '52000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (10, 6, 20, 'Friso Gold Pedia 900g', '579000.00', 1, '579000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (11, 6, 19, 'Vinamilk Pedia Kenji 850g', '419000.00', 1, '419000.00');
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total_price`) VALUES (12, 6, 18, 'Meiji Step Cube 448g', '349000.00', 1, '349000.00');

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `note` text,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` enum('COD','BANK_TRANSFER') DEFAULT 'COD',
  `payment_status` enum('UNPAID','PAID') DEFAULT 'UNPAID',
  `order_status` enum('PENDING','CONFIRMED','SHIPPING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  KEY `idx_order_number` (`order_number`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (1, 'CM2606120001', 2, 'Nguyen Minh Anh', '0901000001', 'Quan 1, TP.HCM', 'Giao gio hanh chinh', '844000.00', 'COD', 'UNPAID', 'PENDING', '2026-06-12 12:15:03', '2026-06-12 13:22:39');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (2, 'CM2605230002', 3, 'Tran Gia Han', '0901000002', 'Quan 3, TP.HCM', 'Goi truoc khi giao', '1014000.00', 'BANK_TRANSFER', 'PAID', 'COMPLETED', '2026-05-23 12:15:03', '2026-06-12 13:22:39');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (3, 'CM2606070003', 4, 'Le Bao Nam', '0901000003', 'Thu Duc, TP.HCM', NULL, '142000.00', 'COD', 'UNPAID', 'CONFIRMED', '2026-06-07 12:15:03', '2026-06-12 13:22:39');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (4, 'CM1781245563114868', 7, 'Khach Hoa Don', '0902222333', 'Dai Loc, Quang Nam', 'Test QR invoice', '395000.00', 'BANK_TRANSFER', 'UNPAID', 'CANCELLED', '2026-06-12 13:26:03', '2026-06-12 13:26:27');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (5, 'CM1781245660354394', 9, 'Gu', '03446672928', 'fff', 'ffff', '97000.00', 'COD', 'UNPAID', 'CANCELLED', '2026-06-12 13:27:40', '2026-06-12 13:27:59');
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `phone`, `address`, `note`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (6, 'CM1781245850007234', 9, 'Gu', '03446672928', 'Quảng Nam', 'Giao Tận Tay', '1347000.00', 'COD', 'UNPAID', 'PENDING', '2026-06-12 13:30:50', '2026-06-12 13:30:50');

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `age_range` varchar(100) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `ingredients` text,
  `benefits` text,
  `usage_instructions` text,
  `short_description` text,
  `description` text,
  `status` tinyint DEFAULT '1',
  `is_featured` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_products_category` (`category_id`),
  KEY `fk_products_brand` (`brand_id`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (1, 1, 4, 'Abbott Grow Gold 900g', 'abbott-grow-gold-900g', 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80', '420000.00', '395000.00', 34, '3-6 tuoi', 'Hoa Ky', '900g', 'DHA, canxi, vitamin D', 'Ho tro chieu cao va tri nao', 'Pha theo huong dan tren hop', 'Sua bot tang truong cho be', 'Cong thuc can bang cho tre mau giao.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 13:26:27');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (2, 1, 5, 'Meiji Hohoemi 800g', 'meiji-hohoemi-800g', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', '515000.00', '499000.00', 22, '0-12 thang', 'Nhat Ban', '800g', 'DHA, ARA, nucleotides', 'Ho tro tieu hoa va mien dich', 'Pha voi nuoc am 70C', 'Sua bot Nhat cho tre so sinh', 'Huong vi thanh nhe, de uong.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (3, 1, 6, 'Friso Gold Pro 850g', 'friso-gold-pro-850g', 'https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80', '560000.00', '535000.00', 18, '1-3 tuoi', 'Ha Lan', '850g', 'HMO, GOS, DHA', 'Ho tro de khang', 'Dung muong dinh luong kem hop', 'Sua bot nhap khau Ha Lan', 'Dinh duong cho he tieu hoa khoe.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (4, 1, 2, 'Nutifood GrowPLUS+ 900g', 'nutifood-growplus-900g', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', '385000.00', '355000.00', 40, '1-10 tuoi', 'Viet Nam', '900g', 'Lysin, kem, canxi', 'Ho tro tang can', 'Pha dung ty le', 'Sua cho tre can tang can', 'Phu hop tre bieng an, thap coi.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (5, 2, 1, 'Vinamilk 100% Organic 1L', 'vinamilk-organic-1l', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', '52000.00', NULL, 100, 'Moi lua tuoi', 'Viet Nam', '1L', 'Sua tuoi huu co', 'Bo sung canxi', 'Uong truc tiep sau khi mo hop', 'Sua tuoi huu co', 'Vi sua tuoi thanh mat, an toan.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 13:27:59');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (6, 2, 3, 'TH true MILK It Duong 1L', 'th-true-milk-it-duong-1l', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80', '48000.00', '45000.00', 90, 'Moi lua tuoi', 'Viet Nam', '1L', 'Sua tuoi, vitamin', 'Phu hop che do it duong', 'Bao quan lanh sau mo nap', 'Sua tuoi it duong', 'Lua chon nhe bung cho moi ngay.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 13:27:59');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (7, 2, 1, 'Vinamilk Green Farm 180ml', 'vinamilk-green-farm-180ml', 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80', '8900.00', NULL, 300, 'Moi lua tuoi', 'Viet Nam', '180ml', 'Sua tuoi', 'Tien loi mang theo', 'Lac deu truoc khi uong', 'Hop sua nho tien loi', 'Phu hop hoc sinh va van phong.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (8, 2, 3, 'TH true MILK Chocolate 180ml', 'th-true-milk-chocolate-180ml', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', '9500.00', NULL, 220, 'Moi lua tuoi', 'Viet Nam', '180ml', 'Sua tuoi, cacao', 'Bo sung nang luong', 'Uong ngon hon khi lanh', 'Sua tuoi vi socola', 'Huong cacao thom, de uong.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (9, 3, 1, 'Vinamilk Sua Dau Nanh Oc Cho 180ml', 'vinamilk-sua-dau-nanh-oc-cho', 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80', '10500.00', NULL, 180, 'Nguoi lon', 'Viet Nam', '180ml', 'Dau nanh, oc cho', 'Tot cho tim mach', 'Uong truc tiep', 'Sua hat tien loi', 'Dinh duong thuc vat moi ngay.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (10, 3, 2, 'NutiFood Sua Hat Hanh Nhan 1L', 'nutifood-sua-hat-hanh-nhan-1l', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', '69000.00', '62000.00', 55, 'Nguoi lon', 'Viet Nam', '1L', 'Hanh nhan, dau nanh', 'Bo sung vitamin E', 'Bao quan lanh sau mo nap', 'Sua hat hanh nhan', 'Vi beo nhe, it ngot.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (11, 3, 3, 'TH true NUT Oc Cho 180ml', 'th-true-nut-oc-cho-180ml', 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80', '12000.00', NULL, 140, 'Nguoi lon', 'Viet Nam', '180ml', 'Oc cho, mac ca', 'Giau omega', 'Uong truc tiep', 'Sua hat dong hop', 'Nang luong thuc vat tien loi.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (12, 4, 4, 'Similac Mom 900g', 'similac-mom-900g', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80', '465000.00', '445000.00', 28, 'Me bau', 'Singapore', '900g', 'DHA, folate, canxi', 'Ho tro me va be', 'Uong 2 ly moi ngay', 'Sua bau Abbott', 'Dinh duong khoa hoc cho thai ky.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (13, 4, 1, 'Vinamilk Optimum Mama 400g', 'vinamilk-optimum-mama-400g', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=80', '205000.00', '189000.00', 36, 'Me bau', 'Viet Nam', '400g', 'DHA, sat, axit folic', 'Ho tro suc khoe thai ky', 'Pha voi nuoc am', 'Sua bau gia tot', 'Hop nho de dung thu.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (14, 4, 2, 'Nuti IQ Mum Gold 900g', 'nuti-iq-mum-gold-900g', 'https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80', '398000.00', NULL, 24, 'Me bau', 'Viet Nam', '900g', 'DHA, choline, prebiotic', 'Ho tro tieu hoa', 'Dung sau bua an', 'Sua cho me bau', 'Vi vani nhe, de uong.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (15, 5, 1, 'Vinamilk Sua Chua Uong Probi 130ml', 'vinamilk-probi-130ml', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', '8500.00', NULL, 260, 'Moi lua tuoi', 'Viet Nam', '130ml', 'Men song probiotic', 'Ho tro tieu hoa', 'Uong lanh ngon hon', 'Sua chua uong men song', 'Hop nho tien loi moi ngay.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (16, 5, 3, 'TH true Yogurt Viet Quat', 'th-true-yogurt-viet-quat', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', '33000.00', '29900.00', 80, 'Moi lua tuoi', 'Viet Nam', '4 hop', 'Sua chua, viet quat', 'Bo sung loi khuan', 'Bao quan lanh', 'Sua chua an vi trai cay', 'Vi viet quat tuoi mat.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (17, 5, 1, 'Vinamilk Susu IQ 110ml', 'vinamilk-susu-iq-110ml', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', '7200.00', NULL, 280, 'Tre em', 'Viet Nam', '110ml', 'Sua chua uong, vitamin', 'Ho tro tre nang dong', 'Uong truc tiep', 'Sua chua uong cho be', 'Huong dau thom ngon.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (18, 6, 5, 'Meiji Step Cube 448g', 'meiji-step-cube-448g', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80', '365000.00', '349000.00', 29, '1-3 tuoi', 'Nhat Ban', '448g', 'DHA, canxi', 'Tien loi khi di choi', 'Moi vien pha theo dinh luong', 'Sua vien tien loi', 'Dong goi dang vien de can do.', 1, 1, '2026-06-12 12:15:03', '2026-06-12 13:30:50');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (19, 6, 1, 'Vinamilk Pedia Kenji 850g', 'vinamilk-pedia-kenji-850g', 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=900&q=80', '449000.00', '419000.00', 19, '2-10 tuoi', 'Viet Nam', '850g', 'Dam whey, MCT, vitamin', 'Ho tro phuc hoi dinh duong', 'Pha 5 muong voi 180ml nuoc', 'Dinh duong cho tre bieng an', 'Cong thuc nang luong cao.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 13:30:50');
INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `image`, `price`, `sale_price`, `stock`, `age_range`, `origin`, `weight`, `ingredients`, `benefits`, `usage_instructions`, `short_description`, `description`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES (20, 6, 6, 'Friso Gold Pedia 900g', 'friso-gold-pedia-900g', 'https://images.unsplash.com/photo-1514846326710-096e4a8035e0?auto=format&fit=crop&w=900&q=80', '610000.00', '579000.00', 15, '2-10 tuoi', 'Ha Lan', '900g', 'Synbiotics, DHA', 'Ho tro tang truong', 'Dung 2-3 ly moi ngay', 'Sua pedia cao cap', 'Cho tre can bo sung dinh duong.', 1, 0, '2026-06-12 12:15:03', '2026-06-12 13:30:50');

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `fk_reviews_product` (`product_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES (1, 3, 2, 5, 'Sua thom nhe, be uong hop va tieu hoa tot.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES (2, 3, 3, 4, 'Dong goi chac chan, giao nhanh.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES (3, 2, 1, 5, 'Gia tot, san pham moi.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES (4, 4, 10, 4, 'Sua hat it ngot, de uong.', 1, '2026-06-12 12:15:03', '2026-06-12 12:15:03');

DROP TABLE IF EXISTS `statistics`;
CREATE TABLE `statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `total_orders` int DEFAULT '0',
  `total_revenue` decimal(12,2) DEFAULT '0.00',
  `total_customers` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` tinyint DEFAULT '1',
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (1, 'Admin Milk Store', 'admin@gmail.com', '0900000000', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'admin', 1, 'Milk Store HQ', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (2, 'Nguyen Minh Anh', 'minhanh@gmail.com', '0901000001', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'user', 1, 'Quan 1, TP.HCM', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (3, 'Tran Gia Han', 'giahan@gmail.com', '0901000002', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'user', 1, 'Quan 3, TP.HCM', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (4, 'Le Bao Nam', 'baonam@gmail.com', '0901000003', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'user', 1, 'Thu Duc, TP.HCM', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (5, 'Pham Thu Trang', 'thutrang@gmail.com', '0901000004', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'user', 1, 'Go Vap, TP.HCM', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (6, 'Vo Quang Huy', 'quanghuy@gmail.com', '0901000005', '$2a$10$bVxjZJU8yNKyxQd5y5T2aOP4l90RKFWjHZWvlUMStISXnimY6gtza', 'user', 1, 'Binh Thanh, TP.HCM', '2026-06-12 12:15:03', '2026-06-12 12:15:03');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (7, 'Admin Sua Chi Mai', 'admin@suachimai.vn', '0987654321', '$2a$10$ryZGWI56E4ZpxK1Q/yY6.O2sSDVvTiLPvKQL4oIRDZ73JC9RTpm82', 'admin', 1, NULL, '2026-06-12 12:24:15', '2026-06-12 12:24:15');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (8, 'Test User', 'test569763486@example.com', '0909999999', '$2a$10$Y4ZqsquMO3i1znxglc4h1OA2MW2C9cAAgcLYEEXj00Mfv5fHpf5dS', 'user', 1, NULL, '2026-06-12 12:25:01', '2026-06-12 12:25:01');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `status`, `address`, `created_at`, `updated_at`) VALUES (9, 'Gu', 'test@gmail.com', '03446672928', '$2a$10$S3mAltt4D4c..MfpJ4STuuslXw33OLpmNb9/geVaeS1dpnIUitgqW', 'user', 1, NULL, '2026-06-12 12:26:51', '2026-06-12 12:26:51');

SET FOREIGN_KEY_CHECKS=1;
