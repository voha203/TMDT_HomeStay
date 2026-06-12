package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Khách hàng đặt phòng

    @ManyToOne
    @JoinColumn(name = "homestay_id")
    private Homestay homestay; // Phòng được đặt

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;

    // Trạng thái đơn hàng: PENDING (Chờ duyệt), CONFIRMED (Đã duyệt), CANCELLED (Đã hủy)
    private String status;

    // Trạng thái thanh toán: UNPAID (Chưa thanh toán), PAID (Đã thanh toán)
    private String paymentStatus;

    // Số lượng khách đặt phòng (Đã được chuyển xuống đây)
    private Integer guests;
}