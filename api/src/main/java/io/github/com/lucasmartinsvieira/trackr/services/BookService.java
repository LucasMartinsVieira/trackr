package io.github.com.lucasmartinsvieira.trackr.services;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.*;
import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibraryClient;
import io.github.com.lucasmartinsvieira.trackr.api.mappers.CreateBookMapper;
import io.github.com.lucasmartinsvieira.trackr.domain.book.BookStatus;
import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.github.com.lucasmartinsvieira.trackr.domain.user.UserRole;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookAccessDeniedException;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookNotFoundException;
import io.github.com.lucasmartinsvieira.trackr.infra.exception.BookStatusNotChangeableException;
import io.github.com.lucasmartinsvieira.trackr.repositories.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final OpenLibraryClient openLibraryClient;

    public BookService(BookRepository bookRepository, OpenLibraryClient openLibraryClient) {
        this.bookRepository = bookRepository;
        this.openLibraryClient = openLibraryClient;
    }

    public Page<BookResponseDTO> findAll(User user, BookStatus status, Pageable pageable) {
        if (status != null) {
            return this.bookRepository.findAllByUserAndStatus(user, status, pageable).map(BookResponseDTO::new);
        } else {
        return this.bookRepository.findAllByUser(user, pageable).map(BookResponseDTO::new);
        }
    }

    public BookResponseDTO findBookById(UUID id, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found!", id)));

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        return new BookResponseDTO(book);
    }

    @Transactional
    public void deleteBook(UUID id, User user) {
        var book = this.bookRepository.getReferenceById(id);

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        this.bookRepository.deleteById(id);
    }

    @Transactional
    public BookResponseDTO changeBookStatus(UUID id, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found", id)));

        // TODO: Add filter instead of this?
        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        if (book.getStatus().equals(BookStatus.TO_READ)) {
            book.setStatus(BookStatus.READING);
            book.setDateStarted(LocalDate.now());
            bookRepository.save(book);
            return new BookResponseDTO(book);
        }
        if (book.getStatus().equals(BookStatus.READING)) {
            book.setStatus(BookStatus.COMPLETE);
            book.setDateFinished(LocalDate.now());
            bookRepository.save(book);
            return new BookResponseDTO(book);
        }

        throw new BookStatusNotChangeableException("Book status can only be TO_READ or READING");
    }

    @Transactional
    public BookResponseDTO createBook(CreateBookRequestDTO dto, User user) {
        var book = CreateBookMapper.map(dto, user);

        bookRepository.save(book);

        return new BookResponseDTO(book);
    }

    @Transactional
    public BookResponseDTO updateBook(UUID id, UpdateBookRequestDTO dto, User user) {
        var book = this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(String.format("Book with ID %s not found", id)));

        if (!book.getUser().equals(user) && user.getRole() != UserRole.ADMIN) {
            throw new BookAccessDeniedException("This book register does not belong to you");
        }

        if (dto.title() != null) book.setTitle(dto.title());
        if (dto.subtitle() != null) book.setSubtitle(dto.subtitle());
        if (dto.authors() != null) book.setAuthors(dto.authors());
        if (dto.publishDate() != null) book.setPublishDate(dto.publishDate());
        if (dto.coverUrl() != null) book.setCoverUrl(dto.coverUrl());
        if (dto.isbn10() != null) book.setIsbn10(dto.isbn10());
        if (dto.isbn13() != null) book.setIsbn13(dto.isbn13());
        if (dto.numberOfPages() != null) book.setNumberOfPages(dto.numberOfPages());
        if (dto.publishers() != null) book.setPublishers(dto.publishers());
        if (dto.type() != null) book.setType(dto.type());
        if (dto.status() != null) book.setStatus(dto.status());
        if (dto.dateStarted() != null) book.setDateStarted(dto.dateStarted());
        if (dto.dateFinished() != null) book.setDateFinished(dto.dateFinished());
        if (dto.notes() != null) book.setNotes(dto.notes());
        if (dto.loved() != null) book.setLoved(dto.loved());

        bookRepository.save(book);

        return new BookResponseDTO(book);
    }

    public OpenLibrarySearchReponseDTO searchBook(OpenLibrarySeachRequestDTO dto) {
        return this.openLibraryClient.searchBook(dto);
    }

    public OpenLibrarySearchEditionsResponseDTO searchEditions(String id) {
        return this.openLibraryClient.searchEditions(id);
    }

    public OpenLibraryBookEntry searchForOpenLibraryEditionEntry(String id) {

        return this.openLibraryClient.searchForEdition(id);
    }

}
