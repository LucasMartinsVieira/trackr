package io.github.com.lucasmartinsvieira.trackr.repositories;

import io.github.com.lucasmartinsvieira.trackr.domain.book.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {
}
