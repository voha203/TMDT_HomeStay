package com.homestay.backend.dto;

import com.homestay.backend.entity.User;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String role
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}