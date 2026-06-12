package com.homestay.backend.repository;

import com.homestay.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Các hàm cũ của bạn giữ nguyên...
    List<Booking> findByUserId(Long userId);
    List<Booking> findByHomestayUserId(Long hostId);

    // THÊM HÀM MỚI NÀY: Kiểm tra xem có đơn hàng nào trùng lịch và đã được CONFIRMED chưa
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.homestay.id = :homestayId " +
            "AND b.status = 'CONFIRMED' " +
            "AND (:checkInDate < b.checkOutDate AND :checkOutDate > b.checkInDate)")
    boolean isRoomOccupied(@Param("homestayId") Long homestayId,
                           @Param("checkInDate") java.time.LocalDate checkInDate,
                           @Param("checkOutDate") java.time.LocalDate checkOutDate);
}