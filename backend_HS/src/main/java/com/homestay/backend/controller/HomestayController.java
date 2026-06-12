package com.homestay.backend.controller;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.service.HomestayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homestays")
@CrossOrigin("*")
public class HomestayController {

    @Autowired
    private HomestayService homestayService;
    @Autowired
    private HomestayRepository homestayRepository;
    // 1. Lấy toàn bộ danh sách hiển thị lên Trang Chủ
    @GetMapping
    public List<Homestay> getAllHomestays() {
        return homestayService.getAllHomestays();
    }

    // 2. Lấy chi tiết 1 homestay khi click từ trang chủ
    @GetMapping("/{id}")
    public ResponseEntity<Homestay> getHomestayById(
            @PathVariable Long id) {

        return homestayService.getHomestayById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. API Đăng Homestay mới gắn liền với ID của Host đang đăng nhập
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createHomestay(
            @PathVariable Long userId,
            @RequestBody Homestay homestay) {

        try {

            Homestay saved =
                    homestayService.createHomestay(userId, homestay);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    // 4. API Sửa thông tin Homestay
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHomestay(
            @PathVariable Long id,
            @RequestBody Homestay newHomestay) {

        try {

            String result =
                    homestayService.updateHomestay(id, newHomestay);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHomestay(
            @PathVariable Long id) {

        try {

            String result =
                    homestayService.deleteHomestay(id);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @GetMapping("/search")
    public ResponseEntity<List<Homestay>> searchHomestay(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                homestayService.searchByTitle(keyword)
        );
    }
    @GetMapping("/filter/location")
    public ResponseEntity<List<Homestay>> filterByLocation(
            @RequestParam String location) {

        return ResponseEntity.ok(
                homestayService.filterByLocation(location)
        );
    }
    @GetMapping("/filter/category")
    public ResponseEntity<List<Homestay>> filterByCategory(
            @RequestParam String category) {

        return ResponseEntity.ok(
                homestayService.filterByCategory(category)
        );
    }
}