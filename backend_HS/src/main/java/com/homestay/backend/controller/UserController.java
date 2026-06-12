package com.homestay.backend.controller;

import com.homestay.backend.dto.UpdateProfileRequest;
import com.homestay.backend.dto.UserProfileResponse;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.UserRepository;
import com.homestay.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*") // Cho phép Frontend kết nối mà không bị chặn CORS
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // 1. API Đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {

        try {

            User savedUser = userService.register(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // 2. API Đăng nhập hệ thống
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        User user = userService.login(loginRequest);

        if (user != null) {
            return ResponseEntity.ok(user);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Email hoặc mật khẩu không chính xác!");
    }

    // 3. API Lấy danh sách toàn bộ User (Dùng cho Admin quản lý sau này)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // ==========================================
    // TÍNH NĂNG MỚI: QUÊN MẬT KHẨU & GỬI MAIL XÁC NHẬN
    // ==========================================

    // 4. API Yêu cầu quên mật khẩu - Kiểm tra email và gửi link chứa Token về Gmail
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    // Sinh ra một chuỗi ngẫu nhiên duy nhất làm mã Token đổi mật khẩu
                    String token = UUID.randomUUID().toString();
                    user.setResetToken(token);
                    userRepository.save(user);

                    try {
                        // Cấu hình nội dung thư gửi đi bằng SimpleMailMessage
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setTo(email);
                        message.setSubject("[Luxestay] - Yêu cầu khôi phục mật khẩu tài khoản");

                        // Link dẫn về trang nhập mật khẩu mới ở Frontend (React chạy port 5173)
                        String resetLink = "http://localhost:5173/reset-password?token=" + token;

                        message.setText("Xin chào " + user.getFullName() + ",\n\n"
                                + "Chúng tôi nhận được yêu cầu lấy lại mật khẩu cho tài khoản Luxestay của bạn.\n"
                                + "Vui lòng click vào đường link bên dưới để tiến hành thiết lập mật khẩu mới:\n\n"
                                + resetLink + "\n\n"
                                + "Nếu bạn không đưa ra yêu cầu này, vui lòng bỏ qua email an toàn.\n"
                                + "Trân trọng,\nĐội ngũ Luxestay Team.");

                        mailSender.send(message); // Lệnh kích hoạt gửi mail thật đi
                        return ResponseEntity.ok("Mã khôi phục đã được gửi vào Gmail của bạn. Vui lòng kiểm tra hòm thư (kể cả hộp thư Spam)!");
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Hệ thống gặp lỗi trong quá trình gửi mail: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.badRequest().body("Địa chỉ Email này không tồn tại trên hệ thống của chúng tôi!"));
    }

    // 5. API Thực hiện cập nhật lại mật khẩu mới thông qua Token từ Link Email (ĐÃ SỬA CHUẨN)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        // Tìm user theo token khôi phục
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Cập nhật mật khẩu mới và xóa sạch mã token đi
            user.setPassword(newPassword.trim()); // Dùng .trim() để tránh lỗi người dùng copy-paste bị thừa dấu cách
            user.setResetToken(null);

            // Lưu và ép dữ liệu đồng bộ xuống MySQL ngay lập tức (saveAndFlush)
            userRepository.saveAndFlush(user);

            return ResponseEntity.ok("Chúc mừng! Bạn đã thay đổi mật khẩu thành công. Vui lòng quay lại giao diện để đăng nhập.");
        } else {
            return ResponseEntity.badRequest().body("Mã xác nhận (Token) không hợp lệ, sai cấu trúc hoặc đã hết hạn sử dụng!");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {

        try {

            User user = userService.getProfile(id);

            return ResponseEntity.ok(UserProfileResponse.from(user));

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {

        try {

            User updatedUser = userService.updateProfile(id, request);

            return ResponseEntity.ok(UserProfileResponse.from(updatedUser));

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        userRepository.deleteById(id);

        return ResponseEntity.ok("Xóa user thành công");
    }
}
