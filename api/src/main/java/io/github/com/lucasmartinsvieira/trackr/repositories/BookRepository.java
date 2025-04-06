package io.github.com.lucasmartinsvieira.trackr.repositories;

import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {
    Page<Book> findAllByUser(User user, Pageable pageable);
}
