package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import java.util.List;

public record OpenLibraryBookEntry(
        List<OpenLibraryAuthorsEntry> authors,
        List<Integer> covers,
        List<String> isbn_10,
        List<String> isbn_13,
        String key,
        int numberOfPages,
        String physicalFormat,
        List<String> publishers,
        String subtitle,
        String title,
        List<OpenLibraryWorkEntry> works) {
}
