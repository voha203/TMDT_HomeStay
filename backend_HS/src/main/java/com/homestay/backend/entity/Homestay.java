package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private Integer bookingCount = 0;
    private Integer viewCount = 0;

    @ManyToMany
    @JoinTable(
            name = "homestay_tags",
            joinColumns = @JoinColumn(name = "homestay_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (bookingCount == null) {
            bookingCount = 0;
        }


        if (viewCount == null) {
            viewCount = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}