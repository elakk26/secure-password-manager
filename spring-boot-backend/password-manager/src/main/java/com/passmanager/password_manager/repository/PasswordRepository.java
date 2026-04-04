package com.passmanager.password_manager.repository;

import com.passmanager.password_manager.model.PasswordEntry;
import com.passmanager.password_manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {
    List<PasswordEntry> findByUser(User user);
}