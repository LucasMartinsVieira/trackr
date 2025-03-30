package io.github.com.lucasmartinsvieira.trackr.api.external;

import io.github.com.lucasmartinsvieira.trackr.api.dtos.books.OpenLibrarySeachRequestDTO;
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

    public String searchEditions(String workId) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("/works/{workId}/editions.json")
                .buildAndExpand(workId)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }

    public String getBookInfo(String bookId) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("/books/{bookId}.json")
                .buildAndExpand(bookId)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }

    private String buildQueryParam(OpenLibrarySearchType openLibrarySearchType) {
        switch (openLibrarySearchType) {
            case GENERAL:
                return "q";
            case ISBN:
                return "isbn";
            case AUTHOR:
                return "author";
            case TITLE:
                return "title";
            default:
                return "q";
        }
    }
}
