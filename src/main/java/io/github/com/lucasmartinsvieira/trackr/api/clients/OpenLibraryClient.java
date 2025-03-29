package io.github.com.lucasmartinsvieira.trackr.api.clients;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OpenLibraryClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String openLibraryApiBaseUrl = "https://openlibrary.org/";

    public String searchBook(String query) {
        String url = UriComponentsBuilder.fromUriString(openLibraryApiBaseUrl)
                .path("search.json")
                .queryParam("q", query)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
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
}
