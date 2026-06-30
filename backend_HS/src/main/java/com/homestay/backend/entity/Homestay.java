package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "homestays")
@Data
public class Homestay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;

    private String location;

    private String image;

    @OneToMany(mappedBy = "homestay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HomestayImage> images = new ArrayList<>();

    private String category;
    @Column(length = 1000)
    private String amenities;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String type;
}