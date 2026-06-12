package com.homestay.backend.repository;

import com.homestay.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndHomestayId(Long userId, Long homestayId);
    void deleteByUserIdAndHomestayId(Long userId, Long homestayId);
}