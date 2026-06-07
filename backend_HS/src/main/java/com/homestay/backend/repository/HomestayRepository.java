package com.homestay.backend.repository;

import com.homestay.backend.entity.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomestayRepository
        extends JpaRepository<Homestay, Long> {

    List<Homestay> findByTitleContainingIgnoreCase(String keyword);

    List<Homestay> findByLocationContainingIgnoreCase(String location);

    List<Homestay> findByCategoryIgnoreCase(String category);
}