package com.homestay.backend.service;

import com.homestay.backend.entity.User;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa------" + passwordEncoder.encode(user.getPassword()));
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
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng"));
    }
    public User updateProfile(
            Long userId,
            User updatedUser) {

        return userRepository.findById(userId)
                .map(user -> {

                    user.setFullName(updatedUser.getFullName());
                    user.setEmail(updatedUser.getEmail());

                    return userRepository.save(user);
                })
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng"));
    }
}