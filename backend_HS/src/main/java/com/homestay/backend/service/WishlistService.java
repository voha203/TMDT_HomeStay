package com.homestay.backend.service;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.entity.User;
import com.homestay.backend.entity.Wishlist;
import com.homestay.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public List<Wishlist> getMyWishlist(Long userId) {

        return wishlistRepository.findByUserId(userId);
    }

    public String toggleWishlist(
            Long userId,
            Long homestayId) {

        Optional<Wishlist> existing =
                wishlistRepository
                        .findByUserIdAndHomestayId(
                                userId,
                                homestayId);

        if (existing.isPresent()) {

            wishlistRepository
                    .deleteByUserIdAndHomestayId(
                            userId,
                            homestayId);

            return "REMOVED";
        }

        Wishlist wishlist = new Wishlist();

        User user = new User();
        user.setId(userId);

        Homestay homestay = new Homestay();
        homestay.setId(homestayId);

        wishlist.setUser(user);
        wishlist.setHomestay(homestay);

        wishlistRepository.save(wishlist);

        return "ADDED";
    }
}