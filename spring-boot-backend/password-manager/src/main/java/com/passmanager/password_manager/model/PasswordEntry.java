package com.passmanager.password_manager.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "password_entries")
@Data
public class PasswordEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String websiteName;

    @Column(nullable = false)
    private String websiteUsername;

    @Column(nullable = false)
    private String encryptedPassword;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}