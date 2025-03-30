package io.github.com.lucasmartinsvieira.trackr.domain.book;

import io.github.com.lucasmartinsvieira.trackr.domain.user.User;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity(name = "books")
@Table(name = "books")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "openlibrary_id", unique = true, nullable = false, length = 20)
    private String openLibraryId;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column
    private String subtitle;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> authors;

    @Column
    private LocalDate publishDate;

    @Column
    private String coverUrl;

    @Column(name = "isbn_10")
    private String isbn10;

    @Column(name = "isbn_13")
    private String isbn13;

    @Column
    private String description;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> publishers;

    @Enumerated(EnumType.STRING)
    @Column
    private BookStatus status = BookStatus.TO_READ;

    @Enumerated(EnumType.STRING)
    @Column
    private BookType type = BookType.PAPERBACK;

    @Column
    private boolean loved = false;

    @Column
    private BigDecimal userRating;

    @Column
    private String notes;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
