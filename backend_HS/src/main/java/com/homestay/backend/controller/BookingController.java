package com.homestay.backend.controller;

import com.homestay.backend.entity.Booking;
import com.homestay.backend.repository.BookingRepository;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    @Autowired
    private HomestayRepository homestayRepository;
    @Autowired
    private BookingRepository bookingRepository;
    // 1. API Đặt phòng (Đã gộp logic kiểm tra ngày tháng và chặn đặt trùng lịch)
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking) {

        try {

            Booking savedBooking =
                    bookingService.createBooking(booking);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedBooking);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getMyBookings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUser(userId)
        );
    }

    // 3. API lấy danh sách đơn đặt phòng gửi tới các Homestay của một Host cụ thể
    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<Booking>> getHostBookings(
            @PathVariable Long hostId) {

        return ResponseEntity.ok(
                bookingService.getHostBookings(hostId)
        );
    }

    // 4. API cập nhật trạng thái đơn hàng (Duyệt hoặc Hủy)
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {

        try {

            String result =
                    bookingService.updateBookingStatus(
                            bookingId,
                            status);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // 5. API Thống kê doanh thu cho Host để vẽ biểu đồ
    @GetMapping("/host/{hostId}/analytics")
    public ResponseEntity<?> getHostAnalytics(
            @PathVariable Long hostId) {

        return ResponseEntity.ok(
                bookingService.getHostAnalytics(hostId)
        );
    }

    // 6. API Cập nhật trạng thái thanh toán từ UNPAID sang PAID
    @PutMapping("/{bookingId}/pay")
    public ResponseEntity<?> payBooking(
            @PathVariable Long bookingId) {

        try {

            String result =
                    bookingService.payBooking(bookingId);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable Long id) {

        bookingRepository.deleteById(id);

        return ResponseEntity.ok(
                "Xóa booking thành công"
        );
    }
    @GetMapping("/admin/revenue")
    public ResponseEntity<Double> getRevenue() {

        return ResponseEntity.ok(
                bookingService.getTotalRevenue()
        );
    }
}