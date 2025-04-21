// API functions for book search and management

/**
 * Search for books in the OpenLibrary API
 */
export async function searchBooks({
  query,
  searchType = "general",
  page = 1,
  limit = 10,
}: {
  query: string;
  searchType?: "general" | "title" | "author" | "isbn";
  page?: number;
  limit?: number;
}) {
  // Build the search URL based on search type
  let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

  // Add specific parameters based on search type
  if (searchType === "title") {
    url += `&title=${encodeURIComponent(query)}`;
  } else if (searchType === "author") {
    url += `&author=${encodeURIComponent(query)}`;
  } else if (searchType === "isbn") {
    // Clean up ISBN input
    const cleanIsbn = query.replace(/[-\s]/g, "");
    url = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(cleanIsbn)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

/**
 * Fetch editions for a specific work
 */
export async function fetchEditions({
  workId,
  page = 1,
  limit = 10,
}: {
  workId: string;
  page?: number;
  limit?: number;
}) {
  // Extract the work ID from the key (e.g., "/works/OL45804W" -> "OL45804W")
  const id = workId.split("/").pop();
  const url = `https://openlibrary.org/works/${id}/editions.json?limit=${limit}&offset=${(page - 1) * limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

/**
 * Save a book to the user's collection
 */
export async function saveBook({
  edition,
  status,
}: {
  edition: any;
  status: string;
}) {
  // Extract all the requested data from the edition
  const bookData = {
    // Extract the OpenLibrary ID from the key (e.g., "/books/OL24746667M" -> "OL24746667M")
    openlibraryId: edition.key ? edition.key.split("/").pop() : null,
    title: edition.title || "",
    subtitle: edition.subtitle || "",
    // Handle authors which might be in different formats depending on the API response
    authors: edition.authors
      ? edition.authors.map((author) => author.name || author)
      : edition.author_name || [],
    publish_date: edition.publish_date || "",
    // Construct cover URL from cover ID
    cover_url:
      edition.covers && edition.covers.length > 0
        ? `https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg`
        : edition.cover_i
          ? `https://covers.openlibrary.org/b/id/${edition.cover_i}-L.jpg`
          : "",
    // Handle ISBNs which might be arrays or single values
    isbn_10: edition.isbn_10
      ? Array.isArray(edition.isbn_10)
        ? edition.isbn_10[0]
        : edition.isbn_10
      : "",
    isbn_13: edition.isbn_13
      ? Array.isArray(edition.isbn_13)
        ? edition.isbn_13[0]
        : edition.isbn_13
      : "",
    number_of_pages: edition.number_of_pages || edition.pages || 0,
    publishers: edition.publishers
      ? Array.isArray(edition.publishers)
        ? edition.publishers
        : [edition.publishers]
      : edition.publisher
        ? [edition.publisher]
        : [],
    reading_status: status,
  };

  // In a real implementation, this would be a POST request to your API
  console.log("Book data to save:", bookData);

  // For now, we'll just return a mock response
  return {
    success: true,
    message: `Book "${edition.title}" saved as "${status}"!`,
    data: bookData,
  };
}
