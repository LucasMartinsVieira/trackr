package io.github.com.lucasmartinsvieira.trackr.api.dtos.books;

import java.util.List;

public record OpenLibraryDocsEntry(
        List<String> authorKey,
        List<String> authorName,
        String coverEditionKey,
        int coverI,
        int editionCount,
        int firstPublishYear,
        boolean hasFullText,
        List<String> ia,
        String iaCollectionS,
        String key,
        List<String> language,
        boolean publicScanB,
        String title) {
}
