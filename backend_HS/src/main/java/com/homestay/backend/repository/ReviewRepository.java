package com.homestay.backend.repository;

import com.homestay.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy toàn bộ bình luận của một homestay cụ thể
    List<Review> findByHomestayIdOrderByIdDesc(Long homestayId);
}