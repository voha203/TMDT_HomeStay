package com.homestay.backend.service;

import com.homestay.backend.entity.Booking;
import com.homestay.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.HashMap;
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {

        if (booking.getCheckInDate().isAfter(booking.getCheckOutDate())
                || booking.getCheckInDate().isEqual(booking.getCheckOutDate())) {

            throw new RuntimeException(
                    "Ngày trả phòng phải sau ngày nhận phòng!");
        }

        boolean isOccupied = bookingRepository.isRoomOccupied(
                booking.getHomestay().getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );

        if (isOccupied) {
            throw new RuntimeException(
                    "Khoảng thời gian này đã được đặt!");
        }

        booking.setStatus("PENDING");
        booking.setPaymentStatus("UNPAID");

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    public String updateBookingStatus(
            Long bookingId,
            String status) {

        return bookingRepository.findById(bookingId)
                .map(booking -> {

                    booking.setStatus(status);

                    bookingRepository.save(booking);

                    return "Cập nhật trạng thái đơn hàng thành công!";
                })
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy đơn đặt phòng"));
    }
    public String payBooking(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .map(booking -> {

                    booking.setPaymentStatus("PAID");

                    bookingRepository.save(booking);

                    return "Thanh toán đơn hàng thành công!";
                })
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy đơn đặt phòng"));
    }
    public List<Booking> getHostBookings(Long hostId) {

        List<Booking> allBookings =
                bookingRepository.findAll();

        return allBookings.stream()
                .filter(b ->
                        b.getHomestay() != null
                                && b.getHomestay().getUser() != null
                                && b.getHomestay().getUser()
                                .getId()
                                .equals(hostId))
                .toList();
    }
    public Map<String, Object> getHostAnalytics(Long hostId) {

        List<Booking> paidBookings =
                bookingRepository.findAll()
                        .stream()
                        .filter(
                                b ->
                                        b.getHomestay() != null
                                                &&
                                                b.getHomestay().getUser() != null
                                                &&
                                                b.getHomestay()
                                                        .getUser()
                                                        .getId()
                                                        .equals(hostId)
                                                &&
                                                "CONFIRMED".equals(
                                                        b.getStatus()
                                                )
                                                &&
                                                "PAID".equals(
                                                        b.getPaymentStatus()
                                                )
                        )
                        .toList();

        Map<String, Object> analytics =
                new HashMap<>();

        double totalRevenue =
                paidBookings
                        .stream()
                        .mapToDouble(
                                Booking::getTotalPrice
                        )
                        .sum();

        analytics.put(
                "totalRevenue",
                totalRevenue
        );

        analytics.put(
                "totalBookings",
                paidBookings.size()
        );

        analytics.put(
                "monthlyLabels",
                Arrays.asList(
                        "T1",
                        "T2",
                        "T3",
                        "T4",
                        "T5",
                        "T6"
                )
        );

        analytics.put(
                "monthlyData",
                Arrays.asList(
                        0,
                        0,
                        0,
                        0,
                        0,
                        totalRevenue
                )
        );

        double apartment = 0;
        double villa = 0;
        double bungalow = 0;

        for (Booking b : paidBookings) {

            String type =
                    b.getHomestay()
                            .getCategory();

            if (type == null)
                continue;

            switch (type.toUpperCase()) {

                case "APARTMENT":
                    apartment +=
                            b.getTotalPrice();
                    break;

                case "VILLA":
                    villa +=
                            b.getTotalPrice();
                    break;

                case "BUNGALOW":
                    bungalow +=
                            b.getTotalPrice();
                    break;
            }
        }

        analytics.put(
                "categoryLabels",
                Arrays.asList(
                        "Căn hộ",
                        "Biệt thự",
                        "Nhà gỗ"
                )
        );

        analytics.put(
                "categoryData",
                Arrays.asList(
                        apartment,
                        villa,
                        bungalow
                )
        );

        return analytics;
    }
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    public Double getTotalRevenue() {

        return bookingRepository.findAll()
                .stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotalPrice)
                .sum();
    }
}