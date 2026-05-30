package com.homestay.backend.controller;

import com.homestay.backend.entity.User;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*") // Cho phép Frontend kết nối mà không bị chặn CORS
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. API Đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // check email này đã tồn tại trong database chưa
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email này đã được đăng ký sử dụng!");
        }

        // tiến hành lưu user mới vào database, nếu chưa có
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // 2. API Đăng nhập hệ thống
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // Tìm kiếm người dùng dựa trên email gửi lên từ Form
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // So sánh mật khẩu thô trong DB với mật khẩu người dùng nhập vào
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(user); // Đăng nhập đúng, trả về thông tin user
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mật khẩu không chính xác!");
            }
        }

        // Nếu không tìm thấy email trong hệ thống
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email tài khoản không tồn tại!");
    }

    // 3. API Lấy danh sách toàn bộ User (Dùng cho Admin quản lý sau này)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}