package com.homestay.backend.repository;

import com.homestay.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Tìm lịch sử đặt phòng của một khách hàng cụ thể
    List<Booking> findByUserId(Long userId);
}