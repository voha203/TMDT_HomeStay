package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    private String category;
    @Column(length = 1000)
    private String amenities;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}