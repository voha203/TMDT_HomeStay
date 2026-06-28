package com.homestay.backend.controller;

import com.homestay.backend.entity.Booking;
import com.homestay.backend.repository.BookingRepository;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/analytics")
    public Map<String,Object> analytics(){

        List<Booking> bookings =
                bookingRepository.findAll();

        double revenue =
                bookings.stream()
                        .filter(b->
                                "PAID".equals(
                                        b.getPaymentStatus()
                                ))
                        .mapToDouble(
                                Booking::getTotalPrice
                        )
                        .sum();

        long pending =
                bookings.stream()
                        .filter(b->
                                "PENDING".equals(
                                        b.getStatus()
                                ))
                        .count();

        long confirmed =
                bookings.stream()
                        .filter(b->
                                "CONFIRMED".equals(
                                        b.getStatus()
                                ))
                        .count();

        long cancelled =
                bookings.stream()
                        .filter(b->
                                "CANCELLED".equals(
                                        b.getStatus()
                                ))
                        .count();

        Map<String,Object> result =
                new HashMap<>();

        result.put(
                "users",
                userRepository.count()
        );

        result.put(
                "homestays",
                homestayRepository.count()
        );

        result.put(
                "bookings",
                bookings.size()
        );

        result.put(
                "revenue",
                revenue
        );

        result.put(
                "bookingStatus",
                Arrays.asList(
                        Map.of(
                                "name",
                                "Pending",
                                "value",
                                pending
                        ),

                        Map.of(
                                "name",
                                "Confirmed",
                                "value",
                                confirmed
                        ),

                        Map.of(
                                "name",
                                "Cancelled",
                                "value",
                                cancelled
                        )
                )
        );

        result.put(
                "monthlyRevenue",
                Arrays.asList(
                        Map.of("month","T1","value",5000000),
                        Map.of("month","T2","value",8000000),
                        Map.of("month","T3","value",12000000),
                        Map.of("month","T4","value",15000000),
                        Map.of("month","T5","value",10000000),
                        Map.of("month","T6","value",20000000)
                )
        );

        return result;
    }

}