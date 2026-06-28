package com.homestay.backend.service;

import com.homestay.backend.dto.ChangePasswordRequest;
import com.homestay.backend.dto.UpdateProfileRequest;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private static final String EMAIL_EXISTS_MESSAGE = "Email đã tồn tại";
    private static final String USER_NOT_FOUND_MESSAGE = "Không tìm thấy người dùng";
    private static final String CURRENT_PASSWORD_INVALID_MESSAGE = "Mật khẩu hiện tại không chính xác";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException(EMAIL_EXISTS_MESSAGE);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public User login(User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                user.setPassword(null);
                user.setResetToken(null);
                return user;
            }
        }

        return null;
    }

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MESSAGE));
    }

    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getProfile(userId);
        String fullName = normalize(request.fullName());
        String email = normalize(request.email());

        userRepository.findByEmail(email)
                .filter(existingUser -> !existingUser.getId().equals(userId))
                .ifPresent(existingUser -> {
                    throw new RuntimeException(EMAIL_EXISTS_MESSAGE);
                });

        user.setFullName(fullName);
        user.setEmail(email);

        return userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getProfile(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new RuntimeException(CURRENT_PASSWORD_INVALID_MESSAGE);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}