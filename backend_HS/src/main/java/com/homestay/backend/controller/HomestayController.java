package com.homestay.backend.controller;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.service.HomestayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.UUID;

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

    @PostMapping(value = "/user/{userId}/with-images", consumes = "multipart/form-data")
    public ResponseEntity<?> createHomestayWithImages(
            @PathVariable Long userId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String location,
            @RequestParam String category,
            @RequestParam String amenities,
            @RequestParam("images") List<MultipartFile> images
    ) {
        try {
            List<String> imageUrls = new ArrayList<>();

            Path uploadPath = Paths.get("uploads/homestays");
            Files.createDirectories(uploadPath);

            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String originalName = file.getOriginalFilename();
                    String extension = originalName != null && originalName.contains(".")
                            ? originalName.substring(originalName.lastIndexOf("."))
                            : "";

                    String fileName = UUID.randomUUID() + extension;
                    Path filePath = uploadPath.resolve(fileName);

                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    imageUrls.add("http://localhost:8080/uploads/homestays/" + fileName);
                }
            }

            Homestay homestay = new Homestay();
            homestay.setTitle(title);
            homestay.setDescription(description);
            homestay.setPrice(price);
            homestay.setLocation(location);
            homestay.setCategory(category);
            homestay.setAmenities(amenities);

            Homestay saved = homestayService.createHomestayWithImages(userId, homestay, imageUrls);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}/with-images", consumes = "multipart/form-data")
    public ResponseEntity<?> updateHomestayWithImages(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String location,
            @RequestParam String category,
            @RequestParam String amenities,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            Homestay updated = homestayService.updateHomestayWithImages(
                    id, title, description, price, location, category, amenities, images
            );

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}