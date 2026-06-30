USE homestay_booking;

SET NAMES utf8mb4;

INSERT INTO users (id, full_name, email, password, role, reset_token) VALUES
(1, 'Nguyễn Văn An', 'user@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'USER', NULL),
(2, 'Trần Chủ Nhà', 'host@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'HOST', NULL),
(3, 'Admin Homestay', 'admin@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'ADMIN', NULL),
(4, 'Lê Minh Hoàng', 'host2@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'HOST', NULL),
(5, 'Nguyễn Quốc Bảo', 'host3@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'HOST', NULL),
(6, 'Phạm Thanh Tùng', 'host4@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'HOST', NULL),
(7, 'Trần Thu Hà', 'user2@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'USER', NULL),
(8, 'Đỗ Gia Huy', 'user3@gmail.com', '$2a$10$NKbT.6GZZcurgWmGz1334u4h4l/IVYUJZ/3UYurmXLiUQio5BPcmi', 'USER', NULL);

INSERT INTO tags (id, name) VALUES
(1, 'View biển'),
(2, 'View núi'),
(3, 'Hồ bơi'),
(4, 'BBQ'),
(5, 'Gần trung tâm'),
(6, 'Cho thú cưng'),
(7, 'Gia đình'),
(8, 'Cặp đôi'),
(9, 'Check-in đẹp'),
(10, 'Bếp riêng'),
(11, 'Bãi đỗ xe'),
(12, 'Yên tĩnh');

INSERT INTO homestays
(id, title, description, price, location, image, category, amenities, user_id, booking_count, view_count, created_at, updated_at, deleted_at)
VALUES
(1, 'Villa Đà Lạt View Đồi Thông', 'Villa yên tĩnh, view đồi thông, phù hợp gia đình và nhóm bạn.', 1200000, 'Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Villa', 'Wifi, Bếp, BBQ, Máy giặt, Bãi đỗ xe, Ban công', 2, 18, 156, '2026-06-01 09:00:00', '2026-06-20 10:00:00', NULL),
(2, 'Căn hộ biển Vũng Tàu', 'Căn hộ gần biển, có ban công, phù hợp nghỉ dưỡng cuối tuần.', 850000, 'Vũng Tàu', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'Apartment', 'Wifi, Điều hòa, Hồ bơi, Gần biển, Thang máy', 2, 25, 210, '2026-06-03 10:00:00', '2026-06-21 10:00:00', NULL),
(3, 'Homestay Hội An Phố Cổ', 'Không gian ấm cúng gần phố cổ Hội An, tiện đi bộ tham quan.', 650000, 'Hội An', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6', 'Homestay', 'Wifi, Xe đạp miễn phí, Ăn sáng, Sân vườn', 2, 12, 98, '2026-06-05 11:00:00', '2026-06-22 10:00:00', NULL),
(4, 'Nhà gỗ Sapa săn mây', 'Nhà gỗ trên cao, view núi, thích hợp nghỉ dưỡng và chụp ảnh.', 950000, 'Sapa', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739', 'Cabin', 'Wifi, Lò sưởi, View núi, Ăn sáng, Ban công', 4, 30, 320, '2026-06-07 08:30:00', '2026-06-23 10:00:00', NULL),
(5, 'Resort mini Phú Quốc', 'Không gian nghỉ dưỡng gần biển, có sân vườn và hồ bơi.', 1500000, 'Phú Quốc', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'Resort', 'Wifi, Hồ bơi, Gần biển, Nhà hàng, Đưa đón sân bay', 5, 28, 260, '2026-06-10 14:00:00', '2026-06-24 10:00:00', NULL),
(6, 'Villa Đồi Thông Premium', 'Villa rộng rãi giữa rừng thông, phù hợp nghỉ dưỡng gia đình.', 1800000, 'Đà Lạt', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Villa', 'Wifi, Hồ bơi, BBQ, Bếp, Đỗ xe', 4, 15, 130, '2026-06-12 09:00:00', '2026-06-25 10:00:00', NULL),
(7, 'Resort Biển Nha Trang', 'View biển tuyệt đẹp, hồ bơi vô cực.', 2200000, 'Nha Trang', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'Resort', 'Wifi, Hồ bơi, Gần biển, Buffet', 5, 33, 410, '2026-06-14 09:00:00', '2026-06-25 10:00:00', NULL),
(8, 'Cabin Gỗ Sapa', 'Nhà gỗ săn mây cực đẹp.', 980000, 'Sapa', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'Cabin', 'Wifi, Lò sưởi, View núi', 4, 21, 188, '2026-06-15 09:00:00', '2026-06-25 10:00:00', NULL),
(9, 'Farmstay Mộc Châu', 'Không gian đồng quê yên bình.', 850000, 'Mộc Châu', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Farmstay', 'Wifi, Sân vườn, BBQ', 6, 8, 72, '2026-06-18 09:00:00', '2026-06-25 10:00:00', NULL),
(10, 'Homestay Hội An Vintage', 'Gần phố cổ, thiết kế cổ điển.', 720000, 'Hội An', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Homestay', 'Wifi, Xe đạp miễn phí', 6, 11, 95, '2026-06-20 09:00:00', '2026-06-25 10:00:00', NULL),
(11, 'Villa Phú Quốc Ocean', 'Villa sát biển có hồ bơi riêng.', 2500000, 'Phú Quốc', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'Villa', 'Wifi, Hồ bơi, Bãi biển riêng', 5, 35, 500, '2026-06-22 09:00:00', '2026-06-25 10:00:00', NULL),
(12, 'Apartment Landmark 81', 'Căn hộ cao cấp trung tâm TP.HCM.', 1200000, 'TP.HCM', 'https://images.unsplash.com/photo-1494526585095-c41746248156', 'Apartment', 'Wifi, Điều hòa, Gym, Hồ bơi', 5, 17, 145, '2026-06-23 09:00:00', '2026-06-25 10:00:00', NULL),
(13, 'Villa Đà Nẵng Luxury', 'Villa gần biển Mỹ Khê.', 1950000, 'Đà Nẵng', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', 'Villa', 'Wifi, Hồ bơi, BBQ', 6, 24, 225, '2026-06-24 09:00:00', '2026-06-25 10:00:00', NULL),
(14, 'Bungalow Côn Đảo', 'Bungalow gỗ giữa thiên nhiên.', 1300000, 'Côn Đảo', 'https://images.unsplash.com/photo-1448630360428-65456885c650', 'Bungalow', 'Wifi, Gần biển, Ăn sáng', 6, 9, 88, '2026-06-25 09:00:00', '2026-06-25 10:00:00', NULL),
(15, 'Mountain View Hà Giang', 'View núi cực đẹp, phù hợp phượt.', 780000, 'Hà Giang', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Homestay', 'Wifi, View núi, Đỗ xe', 4, 19, 170, '2026-06-26 09:00:00', '2026-06-26 10:00:00', NULL);

INSERT INTO homestay_tags (homestay_id, tag_id) VALUES
(1,2),(1,4),(1,7),(1,9),
(2,1),(2,3),(2,5),
(3,5),(3,8),(3,9),
(4,2),(4,9),(4,12),
(5,1),(5,3),(5,7),
(6,2),(6,3),(6,4),(6,7),
(7,1),(7,3),(7,9),
(8,2),(8,9),(8,12),
(9,4),(9,7),(9,12),
(10,5),(10,8),(10,9),
(11,1),(11,3),(11,7),(11,9),
(12,3),(12,5),(12,8),
(13,1),(13,3),(13,4),
(14,1),(14,8),(14,12),
(15,2),(15,9),(15,11);

INSERT INTO homestay_images (image_url, homestay_id) VALUES
('https://images.unsplash.com/photo-1564013799919-ab600027ffc6',1),
('https://images.unsplash.com/photo-1600585154340-be6161a56a0c',1),
('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',2),
('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',2),
('https://images.unsplash.com/photo-1523217582562-09d0def993a6',3),
('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',3),
('https://images.unsplash.com/photo-1510798831971-661eb04b3739',4),
('https://images.unsplash.com/photo-1512917774080-9991f1c4c750',4),
('https://images.unsplash.com/photo-1571896349842-33c89424de2d',5),
('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',5);

INSERT INTO bookings
(id, user_id, homestay_id, check_in_date, check_out_date, total_price, status, payment_status, guests)
VALUES
(1, 1, 1, '2026-07-01', '2026-07-03', 2400000, 'CONFIRMED', 'PAID', 4),
(2, 1, 3, '2026-07-10', '2026-07-12', 1300000, 'PENDING', 'UNPAID', 2),
(3, 7, 5, '2026-08-01', '2026-08-04', 4500000, 'CONFIRMED', 'UNPAID', 3),
(4, 8, 7, '2026-08-05', '2026-08-07', 4400000, 'CONFIRMED', 'PAID', 2),
(5, 1, 11, '2026-08-10', '2026-08-12', 5000000, 'PENDING', 'UNPAID', 4);

INSERT INTO reviews
(id, rating, comment, user_name, homestay_id)
VALUES
(1, 5, 'Phòng đẹp, sạch sẽ, chủ nhà thân thiện.', 'Nguyễn Văn An', 1),
(2, 4, 'Vị trí thuận tiện, giá hợp lý.', 'Minh Anh', 2),
(3, 5, 'Không gian rất chill, đáng tiền.', 'Hoàng Nam', 3),
(4, 4, 'View núi rất đẹp, buổi sáng săn mây ổn.', 'Lan Chi', 4),
(5, 5, 'Resort đẹp, hồ bơi sạch và gần biển.', 'Trần Thu Hà', 5),
(6, 5, 'Villa rộng, phù hợp gia đình đông người.', 'Đỗ Gia Huy', 11);

INSERT INTO wishlists
(id, user_id, homestay_id)
VALUES
(1, 1, 2),
(2, 1, 4),
(3, 7, 5),
(4, 8, 11);