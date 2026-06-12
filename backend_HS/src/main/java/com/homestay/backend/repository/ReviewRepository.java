package com.homestay.backend.repository;

import com.homestay.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy toàn bộ bình luận của một homestay cụ thể
    List<Review> findByHomestayIdOrderByIdDesc(Long homestayId);

    // Tính điểm đánh giá trung bình của một homestay
    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        WHERE r.homestay.id = :homestayId
    """)
    Double getAverageRating(@Param("homestayId") Long homestayId);
}