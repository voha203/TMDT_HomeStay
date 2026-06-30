package com.homestay.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final String BCRYPT_PREFIX = "$2a$";

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
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public User login(User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (checkPassword(loginRequest.getPassword(), user)) {
                user.setPassword(null);
                user.setResetToken(null);
                return user;
            }
        }

        return null;
    }

    @Value("${google.client.id}")
    private String googleClientId;

    public User googleLogin(String token) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        if (idToken == null) {
            throw new RuntimeException("Token Google không hợp lệ");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String fullName = (String) payload.get("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFullName(fullName);
        newUser.setRole("USER");
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        return userRepository.save(newUser);
    }

    private boolean checkPassword(String rawPassword, User user) {
        // BCrypt match — for new users
        if (user.getPassword().startsWith(BCRYPT_PREFIX)) {
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }

        // Plain text match — for old users, auto-migrate to BCrypt on success
        if (user.getPassword().equals(rawPassword)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            return true;
        }

        return false;
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