package io.github.com.lucasmartinsvieira.trackr.api.external;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibraryBookEntry;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchEditionsResponseDTO;
import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySearchReponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OpenLibraryClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String openLibraryApiBaseUrl = "https://openlibrary.org/";

    public OpenLibrarySearchReponseDTO searchBook(OpenLibrarySeachRequestDTO dto) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("search.json")
                .queryParam(buildQueryParam(dto.openLibrarySearchType()), dto.query())
                .toUriString();

        return restTemplate.getForObject(url, OpenLibrarySearchReponseDTO.class);
    }

    public OpenLibrarySearchEditionsResponseDTO searchEditions(String workId) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("/works/{workId}/editions.json")
                .buildAndExpand(workId)
                .toUriString();

        return restTemplate.getForObject(url, OpenLibrarySearchEditionsResponseDTO.class);
    }

    public OpenLibraryBookEntry searchForEdition(String bookId) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("/books/{bookId}.json")
                .buildAndExpand(bookId)
                .toUriString();

        return restTemplate.getForObject(url, OpenLibraryBookEntry.class);
    }

    private String buildQueryParam(OpenLibrarySearchType openLibrarySearchType) {
        return switch (openLibrarySearchType) {
            case GENERAL -> "q";
            case ISBN -> "isbn";
            case AUTHOR -> "author";
            case TITLE -> "title";
        };
    }
}
