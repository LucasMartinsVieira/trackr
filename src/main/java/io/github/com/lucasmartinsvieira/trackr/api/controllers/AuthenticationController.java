package io.github.com.lucasmartinsvieira.trackr.api.controllers;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.AuthenticatedUserResponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.AuthenticationUserRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.LoginResponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.RegisterUserRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.domain.user.*;
import io.github.com.lucasmartinsvieira.trackr.repositories.UserRepository;
import io.github.com.lucasmartinsvieira.trackr.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationUserRequestDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterUserRequestDTO dto) {
        System.out.println(this.userRepository.findByEmail(dto.email()));
        if (this.userRepository.findByEmail(dto.email()) != null) return ResponseEntity.badRequest().build();

        String encriptedPassoword = new BCryptPasswordEncoder().encode(dto.password());
        User newUser = new User(dto.email(), encriptedPassoword, dto.name(), dto.role());
        this.userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearer-key")
    @Operation(description = "Get the authenticated user information", responses = {
            @ApiResponse(description = "Requisição efetuada com sucesso", responseCode = "200", content = {@Content(mediaType = "application/json")}),
            @ApiResponse(description = "Authentication failed", responseCode = "403", content =  {@Content(schema = @Schema(hidden = true))})
    })
    public ResponseEntity<AuthenticatedUserResponseDTO> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new AuthenticatedUserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }
}
