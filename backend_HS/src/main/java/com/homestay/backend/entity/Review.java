package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private String userName; // Lưu nhanh tên người bình luận công khai

    @ManyToOne
    @JoinColumn(name = "homestay_id")
    private Homestay homestay; // Thuộc bài đăng homestay nào
}