package com.homestay.backend.controller;

import com.homestay.backend.entity.Review;
import com.homestay.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // 1. Lấy danh sách bình luận của 1 Homestay
    @GetMapping("/homestay/{homestayId}")
    public List<Review> getReviewsByHomestay(@PathVariable Long homestayId) {
        return reviewRepository.findByHomestayIdOrderByIdDesc(homestayId);
    }

    // 2. Đăng bình luận mới
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewRepository.save(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi gửi bình luận: " + e.getMessage());
        }
    }
}