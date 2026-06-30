package com.homestay.backend.service;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.entity.HomestayImage;
import com.homestay.backend.entity.Tag;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.repository.TagRepository;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

import java.util.List;

@Service
public class HomestayService {

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    public List<Homestay> getAllHomestays() {
        return homestayRepository.findAll();
    }

    public Optional<Homestay> getHomestayById(Long id) {
        return homestayRepository.findById(id);
    }

    public Homestay createHomestay(Long userId, Homestay homestay) {

        Optional<User> userOptional =
                userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy Host");
        }

        homestay.setUser(userOptional.get());

        return homestayRepository.save(homestay);
    }

    public Homestay createHomestayWithImages(Long userId, Homestay homestay, List<String> imageUrls, List<Long> tagIds) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy Host");
        }

        homestay.setUser(userOptional.get());

        if (tagIds != null && !tagIds.isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
            homestay.setTags(tags);
        }

        if (imageUrls != null && !imageUrls.isEmpty()) {
            homestay.setImage(imageUrls.get(0));

            for (String url : imageUrls) {
                HomestayImage image = new HomestayImage();
                image.setImageUrl(url);
                image.setHomestay(homestay);
                homestay.getImages().add(image);
            }
        }

        return homestayRepository.save(homestay);
    }

    public String updateHomestay(Long id, Homestay newHomestay) {

        Optional<Homestay> homestayOptional =
                homestayRepository.findById(id);

        if (homestayOptional.isPresent()) {

            Homestay homestay = homestayOptional.get();

            homestay.setTitle(newHomestay.getTitle());
            homestay.setDescription(newHomestay.getDescription());
            homestay.setPrice(newHomestay.getPrice());
            homestay.setLocation(newHomestay.getLocation());
            homestay.setCategory(newHomestay.getCategory());
            homestay.setAmenities(newHomestay.getAmenities());
            homestay.setImage(newHomestay.getImage());

            homestayRepository.save(homestay);

            return "Cập nhật Homestay thành công!";
        }

        throw new RuntimeException("Không tìm thấy Homestay");
    }

    public String deleteHomestay(Long id) {

        if (homestayRepository.existsById(id)) {

            homestayRepository.deleteById(id);

            return "Xóa Homestay thành công!";
        }

        throw new RuntimeException("Không tìm thấy Homestay");
    }

    public List<Homestay> searchByTitle(String keyword) {

        return homestayRepository
                .findByTitleContainingIgnoreCase(keyword);
    }

    public List<Homestay> filterByLocation(String location) {

        return homestayRepository
                .findByLocationContainingIgnoreCase(location);
    }

    public List<Homestay> filterByCategory(String category) {

        return homestayRepository
                .findByCategoryIgnoreCase(category);
    }

    public Homestay updateHomestayWithImages(
            Long id,
            String title,
            String description,
            Double price,
            String location,
            String category,
            String amenities,
            List<MultipartFile> images
    ) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

        homestay.setTitle(title);
        homestay.setDescription(description);
        homestay.setPrice(price);
        homestay.setLocation(location);
        homestay.setCategory(category);
        homestay.setAmenities(amenities);

        if (images != null && !images.isEmpty()) {
            homestay.getImages().clear();

            try {
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

                        String imageUrl = "http://localhost:8080/uploads/homestays/" + fileName;

                        HomestayImage img = new HomestayImage();
                        img.setImageUrl(imageUrl);
                        img.setHomestay(homestay);

                        homestay.getImages().add(img);
                    }
                }

                if (!homestay.getImages().isEmpty()) {
                    homestay.setImage(homestay.getImages().get(0).getImageUrl());
                }

            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }

        return homestayRepository.save(homestay);
    }

}