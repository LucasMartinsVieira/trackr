package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import io.github.com.lucasmartinsvieira.trackr.api.external.OpenLibrarySearchType;

public record OpenLibrarySeachRequestDTO(String query, OpenLibrarySearchType openLibrarySearchType) {
}
