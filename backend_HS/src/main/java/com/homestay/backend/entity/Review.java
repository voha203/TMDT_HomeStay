package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer rating;
    private String comment;
    private String userName; // Lưu nhanh tên người bình luận công khai

    @ManyToOne
    @JoinColumn(name = "homestay_id")
    private Homestay homestay; // Thuộc bài đăng homestay nào
    @Column(columnDefinition = "TEXT")
    private String reply;

    private LocalDateTime replyDate;
}