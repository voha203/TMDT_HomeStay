package com.homestay.backend.service;

import com.homestay.backend.entity.Review;
import com.homestay.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // --- BƯỚC THÊM MỚI: Hàm lấy toàn bộ review phục vụ cho Frontend lọc ---
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByHomestay(Long homestayId) {
        return reviewRepository.findByHomestayIdOrderByIdDesc(homestayId);
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public String replyReview(Long reviewId, String reply) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy review"));

        review.setReply(reply);
        reviewRepository.save(review);

        return "Phản hồi thành công";
    }
}