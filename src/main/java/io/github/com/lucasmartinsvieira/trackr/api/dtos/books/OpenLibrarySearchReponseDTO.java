package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import java.util.List;

public record OpenLibrarySearchReponseDTO(
        int numFound,
        boolean numFoundExact,
        int numFoundExactInt,
        String q,
        List<OpenLibraryDocsEntry> docs) {
}
