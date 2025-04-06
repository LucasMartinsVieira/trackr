package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
