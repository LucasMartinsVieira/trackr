package io.github.com.lucasmartinsvieira.trackr.controllers;

import io.github.com.lucasmartinsvieira.trackr.domain.user.AuthenticationDTO;
import io.github.com.lucasmartinsvieira.trackr.domain.user.RegisterDTO;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO dto) {
        System.out.println(this.userRepository.findByEmail(dto.email()));
        if (this.userRepository.findByEmail(dto.email()) != null) return ResponseEntity.badRequest().build();

        String encriptedPassoword = new BCryptPasswordEncoder().encode(dto.password());
        System.out.println(encriptedPassoword);

        User newUser = new User(dto.email(), encriptedPassoword, dto.name(), dto.role());
        System.out.println(newUser.getId() + newUser.getEmail() + newUser.getName() + newUser.getRole());

        this.userRepository.save(newUser);
        System.out.println("HERE");

        return ResponseEntity.ok().build();

    }

}
