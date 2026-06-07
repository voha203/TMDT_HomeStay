package com.homestay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;

    private String role;
    // Thêm trường này để lưu token quên mật khẩu
    @Column(name = "reset_token")
    private String resetToken;
}