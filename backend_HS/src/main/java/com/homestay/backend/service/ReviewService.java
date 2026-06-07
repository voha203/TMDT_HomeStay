package com.homestay.backend.service;

import com.homestay.backend.entity.Review;
import com.homestay.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getReviewsByHomestay(Long homestayId) {

        return reviewRepository
                .findByHomestayIdOrderByIdDesc(homestayId);
    }

    public Review createReview(Review review) {

        return reviewRepository.save(review);
    }
}