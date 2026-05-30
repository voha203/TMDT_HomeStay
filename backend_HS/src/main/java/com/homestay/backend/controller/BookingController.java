package com.homestay.backend.controller;

import com.homestay.backend.entity.Booking;
import com.homestay.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // 1. API Đặt phòng (Tạo đơn hàng mới)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            // Mặc định đơn hàng mới tạo sẽ ở trạng thái Chờ duyệt và Chưa thanh toán
            booking.setStatus("PENDING");
            booking.setPaymentStatus("UNPAID");

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi đặt phòng: " + e.getMessage());
        }
    }

    // 2. API Xem lịch sử đặt phòng của một User (Khách hàng)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getMyBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(bookings);
    }
    @Autowired
    private com.homestay.backend.repository.HomestayRepository homestayRepository;
    // 3. API lấy danh sách đơn đặt phòng gửi tới các Homestay của một Host cụ thể
    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<Booking>> getHostBookings(@PathVariable Long hostId) {
        // Lấy toàn bộ bookings, sau đó lọc ra những đơn có homestay thuộc về hostId này
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> hostBookings = allBookings.stream()
                .filter(b -> b.getHomestay() != null && b.getHomestay().getUser() != null
                        && b.getHomestay().getUser().getId().equals(hostId))
                .toList();
        return ResponseEntity.ok(hostBookings);
    }

    // 4. API cập nhật trạng thái đơn hàng (Duyệt hoặc Hủy)
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    booking.setStatus(status); // Gán trạng thái mới: CONFIRMED hoặc CANCELLED
                    bookingRepository.save(booking);
                    return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}