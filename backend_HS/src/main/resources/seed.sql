USE homestay_booking;
SET NAMES utf8mb4;

INSERT INTO users (id, full_name, email, password, role, reset_token) VALUES
(1, 'Nguyễn Văn An', 'user@gmail.com',
 '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi',
 'USER', NULL),
(2, 'Trần Chủ Nhà', 'host@gmail.com',
 '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi',
 'HOST', NULL),
(3, 'Admin Homestay', 'admin@gmail.com',
 '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi',
 'ADMIN', NULL);

 INSERT INTO users(full_name,email,password,role,reset_token)
 VALUES
 ('Lê Minh Hoàng','host2@gmail.com','$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi','HOST',NULL),
 ('Nguyễn Quốc Bảo','host3@gmail.com','$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi','HOST',NULL),
 ('Phạm Thanh Tùng','host4@gmail.com','$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi','HOST',NULL),
 ('Trần Thu Hà','user2@gmail.com','$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi','USER',NULL),
 ('Đỗ Gia Huy','user3@gmail.com','$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi','USER',NULL);

INSERT INTO homestays
(id, title, description, price, location, image, category, amenities, user_id) VALUES
(1, 'Villa Đà Lạt View Đồi Thông',
 'Villa yên tĩnh, view đồi thông, phù hợp gia đình và nhóm bạn.',
 1200000, 'Đà Lạt, Lâm Đồng',
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
 'Villa',
 'Wifi, Bếp, BBQ, Máy giặt, Bãi đỗ xe, Ban công',
 2),
(2, 'Căn hộ biển Vũng Tàu',
 'Căn hộ gần biển, có ban công, phù hợp nghỉ dưỡng cuối tuần.',
 850000, 'Vũng Tàu, Bà Rịa - Vũng Tàu',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
 'Apartment',
 'Wifi, Điều hòa, Hồ bơi, Gần biển, Thang máy',
 2),
(3, 'Homestay Hội An Phố Cổ',
 'Không gian ấm cúng gần phố cổ Hội An, tiện đi bộ tham quan.',
 650000, 'Hội An, Quảng Nam',
 'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
 'Homestay',
 'Wifi, Xe đạp miễn phí, Ăn sáng, Sân vườn',
 2),
(4, 'Nhà gỗ Sapa săn mây',
 'Nhà gỗ trên cao, view núi, thích hợp nghỉ dưỡng và chụp ảnh.',
 950000, 'Sapa, Lào Cai',
 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
 'Cabin',
 'Wifi, Lò sưởi, View núi, Ăn sáng, Ban công',
 2),
(5, 'Resort mini Phú Quốc',
 'Không gian nghỉ dưỡng gần biển, có sân vườn và hồ bơi.',
 1500000, 'Phú Quốc, Kiên Giang',
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
 'Resort',
 'Wifi, Hồ bơi, Gần biển, Nhà hàng, Đưa đón sân bay',
 2);
 INSERT INTO homestays
 (title,description,price,location,image,category,amenities,user_id)
 VALUES

 (
 'Villa Đồi Thông Premium',
 'Villa rộng rãi giữa rừng thông, phù hợp nghỉ dưỡng gia đình.',
 1800000,
 'Đà Lạt',
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
 'Villa',
 'Wifi,Hồ bơi,BBQ,Bếp,Đỗ xe',
 2
 ),

 (
 'Resort Biển Nha Trang',
 'View biển tuyệt đẹp, hồ bơi vô cực.',
 2200000,
 'Nha Trang',
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
 'Resort',
 'Wifi,Hồ bơi,Gần biển,Buffet',
 2
 ),

 (
 'Cabin Gỗ Sapa',
 'Nhà gỗ săn mây cực đẹp.',
 980000,
 'Sapa',
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
 'Cabin',
 'Wifi,Lò sưởi,View núi',
 4
 ),

 (
 'Farmstay Mộc Châu',
 'Không gian đồng quê yên bình.',
 850000,
 'Mộc Châu',
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
 'Farmstay',
 'Wifi,Sân vườn,BBQ',
 4
 ),

 (
 'Homestay Hội An Vintage',
 'Gần phố cổ, thiết kế cổ điển.',
 720000,
 'Hội An',
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
 'Homestay',
 'Wifi,Xe đạp miễn phí',
 4
 ),

 (
 'Villa Phú Quốc Ocean',
 'Villa sát biển có hồ bơi riêng.',
 2500000,
 'Phú Quốc',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
 'Villa',
 'Wifi,Hồ bơi,Bãi biển riêng',
 5
 ),

 (
 'Apartment Landmark 81',
 'Căn hộ cao cấp trung tâm TP.HCM.',
 1200000,
 'TP.HCM',
 'https://images.unsplash.com/photo-1494526585095-c41746248156',
 'Apartment',
 'Wifi,Điều hòa,Gym,Hồ bơi',
 5
 ),

 (
 'Villa Đà Nẵng Luxury',
 'Villa gần biển Mỹ Khê.',
 1950000,
 'Đà Nẵng',
 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
 'Villa',
 'Wifi,Hồ bơi,BBQ',
 5
 ),

 (
 'Bungalow Côn Đảo',
 'Bungalow gỗ giữa thiên nhiên.',
 1300000,
 'Côn Đảo',
 'https://images.unsplash.com/photo-1448630360428-65456885c650',
 'Bungalow',
 'Wifi,Gần biển,Ăn sáng',
 6
 ),

 (
 'Mountain View Hà Giang',
 'View núi cực đẹp, phù hợp phượt.',
 780000,
 'Hà Giang',
 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
 'Homestay',
 'Wifi,View núi,Đỗ xe',
 6
 );

INSERT INTO bookings
(id, user_id, homestay_id, check_in_date, check_out_date, total_price, status, payment_status, guests) VALUES
(1, 1, 1, '2026-07-01', '2026-07-03', 2400000, 'CONFIRMED', 'PAID', 4),
(2, 1, 3, '2026-07-10', '2026-07-12', 1300000, 'PENDING', 'UNPAID', 2),
(3, 1, 5, '2026-08-01', '2026-08-04', 4500000, 'CONFIRMED', 'UNPAID', 3);

INSERT INTO reviews
(id, rating, comment, user_name, homestay_id) VALUES
(1, 5, 'Phòng đẹp, sạch sẽ, chủ nhà thân thiện.', 'Nguyễn Văn An', 1),
(2, 4, 'Vị trí thuận tiện, giá hợp lý.', 'Minh Anh', 2),
(3, 5, 'Không gian rất chill, đáng tiền.', 'Hoàng Nam', 3),
(4, 4, 'View núi rất đẹp, buổi sáng săn mây ổn.', 'Lan Chi', 4);

INSERT INTO wishlists
(id, user_id, homestay_id) VALUES
(1, 1, 2),
(2, 1, 4);