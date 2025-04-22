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
 * Extract author names from an edition object
 */
export function extractAuthorNames(edition: any): string[] {
  // If edition has authors array with objects containing name property
  if (edition.authors && Array.isArray(edition.authors)) {
    return edition.authors.map((author) => {
      // Handle both {name: "Author Name"} and "Author Name" formats
      return typeof author === "object" && author !== null
        ? author.name || "Unknown Author"
        : author;
    });
  }

  // If edition has author_name array (common in search results)
  if (edition.author_name && Array.isArray(edition.author_name)) {
    return edition.author_name;
  }

  // If edition has a single author
  if (
    edition.author &&
    typeof edition.author === "object" &&
    edition.author !== null
  ) {
    return [edition.author.name || "Unknown Author"];
  }

  // If edition has a single author as string
  if (edition.author && typeof edition.author === "string") {
    return [edition.author];
  }

  // Default to empty array if no author information is found
  return [];
}

/**
 * Format a publish date string into a Date object
 */
export function formatPublishDate(dateString: string): string | null {
  if (!dateString) return null;

  // Try to parse the date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  // Handle formats like "May 2017" or just "2017"
  const yearMatch = dateString.match(/\b\d{4}\b/);
  if (yearMatch) {
    const year = Number.parseInt(yearMatch[0]);

    // Check for month names
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let month = 0; // Default to January
    for (let i = 0; i < months.length; i++) {
      if (
        dateString.includes(months[i]) ||
        dateString.includes(months[i].substring(0, 3))
      ) {
        month = i;
        break;
      }
    }

    // Check for day
    const dayMatch = dateString.match(/\b\d{1,2}\b(?!\d)/);
    const day =
      dayMatch && dayMatch[0] !== yearMatch[0]
        ? Number.parseInt(dayMatch[0])
        : 1;

    // Create a new date with the extracted components
    const formattedDate = new Date(year, month, day);
    return formattedDate.toISOString();
  }

  // If we can't parse the date, return null
  return null;
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
