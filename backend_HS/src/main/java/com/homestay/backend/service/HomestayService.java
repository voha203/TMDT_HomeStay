package com.homestay.backend.service;

import com.homestay.backend.entity.Homestay;
import com.homestay.backend.entity.User;
import com.homestay.backend.repository.HomestayRepository;
import com.homestay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HomestayService {

    @Autowired
    private HomestayRepository homestayRepository;

    @Autowired
    private UserRepository userRepository;

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
    public String updateHomestay(Long id, Homestay newHomestay) {

        Optional<Homestay> homestayOptional =
                homestayRepository.findById(id);

        if (homestayOptional.isPresent()) {

            Homestay homestay = homestayOptional.get();

            homestay.setTitle(newHomestay.getTitle());
            homestay.setDescription(newHomestay.getDescription());
            homestay.setPrice(newHomestay.getPrice());
            homestay.setLocation(newHomestay.getLocation());
            homestay.setAmenities(newHomestay.getAmenities());
            homestay.setImage(newHomestay.getImage());
            homestay.setCategory(newHomestay.getCategory());

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

}