package com.homestay.backend.controller;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/homestays")
@CrossOrigin("*")
public class HomestayController {

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Lấy toàn bộ danh sách hiển thị lên Trang Chủ
    @GetMapping
    public List<Homestay> getAllHomestays() {
        return homestayRepository.findAll();
    }

    // 2. Lấy chi tiết 1 homestay khi click từ trang chủ
    @GetMapping("/{id}")
    public ResponseEntity<Homestay> getHomestayById(@PathVariable Long id) {
        return homestayRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. API Đăng Homestay mới gắn liền với ID của Host đang đăng nhập
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createHomestay(@PathVariable Long userId, @RequestBody Homestay homestay) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            // Gán thông tin User (Host) tìm được vào đối tượng Homestay
            homestay.setUser(userOptional.get());

            Homestay savedHomestay = homestayRepository.save(homestay);
            return ResponseEntity.ok(savedHomestay);
        }

        return ResponseEntity.badRequest().body("Không tìm thấy thông tin tài khoản Host này!");
    }
}