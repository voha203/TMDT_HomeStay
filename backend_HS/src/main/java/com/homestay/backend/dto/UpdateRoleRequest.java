package com.homestay.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequest(
        @NotBlank(message = "Vai trò không được để trống")
        String role
) {
}