package com.homestay.backend.controller;

import com.homestay.backend.entity.Wishlist;
import com.homestay.backend.entity.User;
import com.homestay.backend.entity.Homestay;
import com.homestay.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.homestay.backend.service.WishlistService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // 1. Lấy danh sách các phòng đã thả tim của 1 User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getMyWishlist(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                wishlistService.getMyWishlist(userId)
        );
    }

    // 2. API Thả tim / Bỏ thả tim (Toggle)
    @PostMapping("/toggle")
    @Transactional
    public ResponseEntity<?> toggleWishlist(
            @RequestParam Long userId,
            @RequestParam Long homestayId) {

        try {

            String result =
                    wishlistService.toggleWishlist(
                            userId,
                            homestayId);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}