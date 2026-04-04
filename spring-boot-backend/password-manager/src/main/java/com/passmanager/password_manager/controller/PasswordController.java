package com.passmanager.password_manager.controller;

import com.passmanager.password_manager.model.PasswordEntry;
import com.passmanager.password_manager.model.User;
import com.passmanager.password_manager.repository.PasswordRepository;
import com.passmanager.password_manager.repository.UserRepository;
import com.passmanager.password_manager.security.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/passwords")
@CrossOrigin(origins = "*")
public class PasswordController {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AESUtil aesUtil;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping("/all")
    public List<PasswordEntry> getAllPasswords() {
        User user = getCurrentUser();
        List<PasswordEntry> entries = passwordRepository.findByUser(user);
        entries.forEach(e -> e.setEncryptedPassword(
                aesUtil.decrypt(e.getEncryptedPassword())));
        return entries;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPassword(@RequestBody PasswordEntry entry) {
        User user = getCurrentUser();
        entry.setUser(user);
        entry.setEncryptedPassword(aesUtil.encrypt(entry.getEncryptedPassword()));
        passwordRepository.save(entry);
        return ResponseEntity.ok("Password saved!");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePassword(@PathVariable Long id) {
        passwordRepository.deleteById(id);
        return ResponseEntity.ok("Password deleted!");
    }
}