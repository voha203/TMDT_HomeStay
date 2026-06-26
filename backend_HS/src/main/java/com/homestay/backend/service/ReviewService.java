package com.homestay.backend.service;

import com.homestay.backend.entity.Review;
import com.homestay.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private static final int MIN_RATING = 1;
    private static final int MAX_RATING = 5;
    private static final String INVALID_RATING_MESSAGE = "Số sao đánh giá phải từ 1 đến 5";
    private static final String EMPTY_COMMENT_MESSAGE = "Nội dung đánh giá không được để trống";

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getReviewsByHomestay(Long homestayId) {

        return reviewRepository
                .findByHomestayIdOrderByIdDesc(homestayId);
    }

    public Double getAverageRating(Long homestayId) {
        Double averageRating = reviewRepository.getAverageRating(homestayId);
        return averageRating == null ? 0.0 : Math.round(averageRating * 10.0) / 10.0;
    }

    public Review createReview(Review review) {
        validateReview(review);
        review.setComment(review.getComment().trim());
        return reviewRepository.save(review);
    }

    private void validateReview(Review review) {
        if (review.getRating() == null || review.getRating() < MIN_RATING || review.getRating() > MAX_RATING) {
            throw new RuntimeException(INVALID_RATING_MESSAGE);
        }
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            throw new RuntimeException(EMPTY_COMMENT_MESSAGE);
        }
    }
}
