package com.homestay.backend.service;

import com.homestay.backend.entity.Booking;
import com.homestay.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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

        List<Booking> confirmedBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getHomestay() != null
                        && b.getHomestay().getUser() != null
                        && b.getHomestay().getUser().getId().equals(hostId)
                        && "CONFIRMED".equals(b.getStatus()))
                .toList();

        double totalRevenue = confirmedBookings.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        int totalBookings = confirmedBookings.size();

        Map<String, Object> analytics = new HashMap<>();

        analytics.put("totalRevenue", totalRevenue);
        analytics.put("totalBookings", totalBookings);

        analytics.put("monthlyLabels",
                Arrays.asList("Tháng 1", "Tháng 2", "Tháng 3",
                        "Tháng 4", "Tháng 5", "Tháng 6"));

        analytics.put("monthlyData",
                Arrays.asList(
                        totalRevenue * 0.1,
                        totalRevenue * 0.15,
                        totalRevenue * 0.2,
                        totalRevenue * 0.12,
                        totalRevenue * 0.18,
                        totalRevenue
                ));

        Map<String, Double> categoryRevenue = getCategoryRevenue(confirmedBookings);

        analytics.put("categoryLabels",
                categoryRevenue.keySet().stream().toList());

        analytics.put("categoryData",
                categoryRevenue.values().stream().toList());

        return analytics;
    }

    private Map<String, Double> getCategoryRevenue(List<Booking> confirmedBookings) {
        return confirmedBookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getHomestay() != null ? b.getHomestay().getCategory() : "Khác",
                        Collectors.summingDouble(Booking::getTotalPrice)
                ));
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