package com.homestay.backend.repository;

import com.homestay.backend.entity.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomestayRepository
        extends JpaRepository<Homestay, Long> {

}