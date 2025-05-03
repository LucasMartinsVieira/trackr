/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Book,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  XCircle,
  PauseCircle,
  BookText,
  User,
  Barcode,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInfiniteQuery } from "@tanstack/react-query";

// Import the Dialog components and useRouter
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBooks } from "@/hooks/useBooks";
import { useAuthContext } from "@/components/providers/auth-provider";

// API functions
const searchBooks = async ({ query, searchType, page = 1, limit = 10 }) => {
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
};

const fetchEditions = async ({ workId, page = 1, limit = 10 }) => {
  // Extract the work ID from the key (e.g., "/works/OL45804W" -> "OL45804W")
  const id = workId.split("/").pop();
  const url = `https://openlibrary.org/works/${id}/editions.json?limit=${limit}&offset=${(page - 1) * limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function NewBookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("general");
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [readingStatus, setReadingStatus] = useState("reading");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const { addBook } = useBooks();

  const { token } = useAuthContext();

  // In the NewBookPage component, add these new state variables
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookToSave, setBookToSave] = useState(null);

  // Refs for scrolling
  const searchRef = useRef(null);
  const worksRef = useRef(null);
  const editionsRef = useRef(null);
  const statusRef = useRef(null);

  // React Query for search results
  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useInfiniteQuery({
    queryKey: ["searchBooks", searchQuery, searchType],
    queryFn: ({ pageParam = 1 }) =>
      searchBooks({
        query: searchQuery,
        searchType,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalResults = lastPage.numFound || 0;
      const loadedResults = allPages.reduce(
        (count, page) => count + (page.docs?.length || 0),
        0,
      );
      return loadedResults < totalResults ? allPages.length + 1 : undefined;
    },
    enabled: isSearchSubmitted && searchQuery.trim() !== "",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for editions
  const {
    data: editionsData,
    fetchNextPage: fetchNextEditionsPage,
    hasNextPage: hasNextEditionsPage,
    isFetchingNextPage: isFetchingNextEditionsPage,
    isLoading: isEditionsLoading,
    isError: isEditionsError,
    error: editionsError,
  } = useInfiniteQuery({
    queryKey: ["editions", selectedWork?.key],
    queryFn: ({ pageParam = 1 }) =>
      fetchEditions({
        workId: selectedWork?.key,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalEditions = lastPage.size || 0;
      const loadedEditions = allPages.reduce(
        (count, page) => count + (page.entries?.length || 0),
        0,
      );
      return loadedEditions < totalEditions ? allPages.length + 1 : undefined;
    },
    enabled: !!selectedWork?.key,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten the search results from all pages
  const searchResults =
    searchData?.pages.flatMap((page) => page.docs || []) || [];

  // Flatten the editions from all pages
  const editions =
    editionsData?.pages.flatMap((page) => page.entries || []) || [];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    setIsSearchSubmitted(true);
    setCurrentStep(2);

    // Reset selections when performing a new search
    setSelectedWork(null);
    setSelectedEdition(null);
  };

  // Handle work selection
  const handleWorkSelect = (work) => {
    setSelectedWork(work);
    setCurrentStep(3);

    // Add a small delay to ensure DOM updates before scrolling
    setTimeout(() => {
      editionsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Handle edition selection
  const handleEditionSelect = (edition) => {
    setSelectedEdition(edition);
    setCurrentStep(4);

    // Add a small delay to ensure DOM updates before scrolling
    setTimeout(() => {
      statusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Replace the handleSaveBook function with this updated version
  const handleSaveBook = () => {
    // Extract all the requested data from the selected edition
    const editionData = {
      // Extract the OpenLibrary ID from the key (e.g., "/books/OL24746667M" -> "OL24746667M")
      openlibraryId: selectedEdition.key
        ? selectedEdition.key.split("/").pop()
        : null,
      title: selectedEdition.title || "",
      subtitle: selectedEdition.subtitle || "",
      // Extract author names, handling different possible formats
      authors: extractAuthorNames(selectedEdition),
      publish_date: selectedEdition.publish_date
        ? formatPublishDate(selectedEdition.publish_date)
        : null,
      // Construct cover URL from cover ID
      cover_url:
        selectedEdition.covers && selectedEdition.covers.length > 0
          ? `https://covers.openlibrary.org/b/id/${selectedEdition.covers[0]}-L.jpg`
          : selectedEdition.cover_i
            ? `https://covers.openlibrary.org/b/id/${selectedEdition.cover_i}-L.jpg`
            : "",
      // Handle ISBNs which might be arrays or single values
      isbn_10: selectedEdition.isbn_10
        ? Array.isArray(selectedEdition.isbn_10)
          ? selectedEdition.isbn_10[0]
          : selectedEdition.isbn_10
        : "",
      isbn_13: selectedEdition.isbn_13
        ? Array.isArray(selectedEdition.isbn_13)
          ? selectedEdition.isbn_13[0]
          : selectedEdition.isbn_13
        : "",
      number_of_pages:
        selectedEdition.number_of_pages || selectedEdition.pages || 0,
      publishers: selectedEdition.publishers
        ? Array.isArray(selectedEdition.publishers)
          ? selectedEdition.publishers
          : [selectedEdition.publishers]
        : selectedEdition.publisher
          ? [selectedEdition.publisher]
          : [],
      // Include the reading status
      reading_status: readingStatus,
    };

    // Store the data and show confirmation modal
    setBookToSave(editionData);
    setShowConfirmation(true);
  };

  // Add this helper function to format publish dates
  const formatPublishDate = (dateString) => {
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
  };

  // Add this helper function to extract author names
  const extractAuthorNames = (edition) => {
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
  };

  // Add a function to handle confirmation
  const handleConfirmSave = async () => {
    // Close the modal
    setShowConfirmation(false);

    if (!token) return;

    await addBook({
      title: bookToSave.title,
      subtitle: bookToSave.subtitle,
      // authors: editionData.authors,
      authors: bookToSave.authors,
      reading_status: bookToSave.reading_status as ReadingStatus,
      publish_date: bookToSave.publish_date,
      publishers: bookToSave.publishers,
      number_of_pages: bookToSave.number_of_pages,
      isbn_10: bookToSave.isbn_10,
      isbn_13: bookToSave.isbn_13,
      cover_url: bookToSave.cover_url,
      openLibraryId: bookToSave.openlibraryId,
      token,
    });

    // Navigate to the books page
    router.push("/books");
  };

  // Get placeholder text based on search type
  const getPlaceholderText = () => {
    switch (searchType) {
      case "title":
        return "Enter book title...";
      case "author":
        return "Enter author name...";
      case "isbn":
        return "Enter ISBN number...";
      default:
        return "Enter book title, author, or ISBN...";
    }
  };

  // Auto-scroll to the current step
  useEffect(() => {
    if (currentStep === 1 && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (currentStep === 2 && worksRef.current) {
      worksRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (currentStep === 3 && editionsRef.current) {
      editionsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (currentStep === 4 && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-12">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div
            className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              1
            </div>
            <span className="text-xs mt-1">Search</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              2
            </div>
            <span className="text-xs mt-1">Works</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              3
            </div>
            <span className="text-xs mt-1">Editions</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-2 ${currentStep >= 4 ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex flex-col items-center ${currentStep >= 4 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              4
            </div>
            <span className="text-xs mt-1">Status</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Add a New Book</h1>
        <p className="text-muted-foreground">
          Search for a book, select a work, choose an edition, and save it to
          your collection
        </p>
      </div>

      {/* Step 1: Search */}
      <section ref={searchRef} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            1
          </div>
          <h2 className="text-xl font-semibold">Search for a book</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <Tabs
                value={searchType}
                onValueChange={setSearchType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">General</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="title"
                    className="flex items-center gap-1"
                  >
                    <BookText className="w-4 h-4" />
                    <span className="hidden sm:inline">Title</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="author"
                    className="flex items-center gap-1"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Author</span>
                  </TabsTrigger>
                  <TabsTrigger value="isbn" className="flex items-center gap-1">
                    <Barcode className="w-4 h-4" />
                    <span className="hidden sm:inline">ISBN</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={getPlaceholderText()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearchLoading}>
                  {isSearchLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Step 2: Select Work */}
      {isSearchSubmitted && (
        <section ref={worksRef} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <h2 className="text-xl font-semibold">Select a work</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {isSearchLoading
                  ? "Searching..."
                  : isSearchError
                    ? "Error loading results"
                    : searchData?.pages[0]?.numFound
                      ? `Found ${searchData.pages[0].numFound} works matching your search`
                      : "No results found"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSearchLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {isSearchError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {searchError?.message ||
                      "Failed to load search results. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              {!isSearchLoading &&
                !isSearchError &&
                searchResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No books found matching your search. Try different keywords
                    or search options.
                  </div>
                )}

              <div className="grid gap-4">
                {searchResults.map((work) => (
                  <Card
                    key={work.key}
                    className={`cursor-pointer transition-all ${
                      selectedWork?.key === work.key
                        ? "ring-2 ring-primary"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleWorkSelect(work)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden">
                        <img
                          src={
                            work.cover_i
                              ? `https://covers.openlibrary.org/b/id/${work.cover_i}-M.jpg`
                              : "/placeholder.svg?height=160&width=120"
                          }
                          alt={work.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{work.title}</h3>
                          {work.ratings_average >= 4 && (
                            <Badge variant="secondary" className="ml-2">
                              <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {work.author_name?.join(", ")} •{" "}
                          {work.first_publish_year}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {hasNextPage && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Results"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {searchResults.length > 0 && selectedWork && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  editionsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Continue to Editions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Step 3: Select Edition */}
      {selectedWork && (
        <section ref={editionsRef} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <h2 className="text-xl font-semibold">Select an edition</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Editions of &quot;{selectedWork?.title}&quot;
              </CardTitle>
              <CardDescription>
                {isEditionsLoading
                  ? "Loading editions..."
                  : isEditionsError
                    ? "Error loading editions"
                    : editionsData?.pages[0]?.size
                      ? `Found ${editionsData.pages[0].size} editions`
                      : "No editions found"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isEditionsLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {isEditionsError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {editionsError?.message ||
                      "Failed to load editions. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              {!isEditionsLoading &&
                !isEditionsError &&
                editions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No editions found for this work.
                  </div>
                )}

              <div className="grid gap-4">
                {editions.map((edition) => (
                  <Card
                    key={edition.key}
                    className={`cursor-pointer transition-all ${
                      selectedEdition?.key === edition.key
                        ? "ring-2 ring-primary"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleEditionSelect(edition)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden">
                        <img
                          src={
                            edition.covers?.[0]
                              ? `https://covers.openlibrary.org/b/id/${edition.covers[0]}-M.jpg`
                              : "/placeholder.svg?height=160&width=120"
                          }
                          alt={edition.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{edition.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {edition.publishers?.[0] || "Unknown publisher"} •{" "}
                          {edition.publish_date || "Unknown date"} •{" "}
                          {edition.physical_format || "Unknown format"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edition.number_of_pages
                            ? `${edition.number_of_pages} pages • `
                            : ""}
                          ISBN:{" "}
                          {edition.isbn_13?.[0] ||
                            edition.isbn_10?.[0] ||
                            "Unknown"}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {hasNextEditionsPage && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextEditionsPage()}
                    disabled={isFetchingNextEditionsPage}
                  >
                    {isFetchingNextEditionsPage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Editions"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {editions.length > 0 && selectedEdition && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  statusRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Continue to Reading Status
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Step 4: Set Reading Status */}
      {selectedEdition && (
        <section ref={statusRef} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              4
            </div>
            <h2 className="text-xl font-semibold">Set reading status</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How would you like to save this book?</CardTitle>
              <CardDescription>
                Select the reading status for &quot;{selectedEdition.title}
                &quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={readingStatus}
                onValueChange={setReadingStatus}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="READING" id="reading" />
                  <Label htmlFor="reading" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Currently Reading
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TO_READ" id="to-read" />
                  <Label htmlFor="to-read" className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    Want to Read
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COMPLETE" id="read" />
                  <Label htmlFor="read" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Already Read
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAUSED" id="paused" />
                  <Label htmlFor="paused" className="flex items-center gap-2">
                    <PauseCircle className="w-4 h-4" />
                    Paused Reading
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DROPPED" id="dropped" />
                  <Label htmlFor="dropped" className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Dropped
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBook} className="w-full">
                Save Book
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}
      {/* Add the confirmation modal at the end of the component, just before the closing div */}
      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Book Addition</DialogTitle>
            <DialogDescription>
              Are you sure you want to add &quot;{bookToSave?.title}&quot; to
              your {readingStatus} list?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            {bookToSave?.cover_url && (
              <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden">
                <img
                  src={bookToSave.cover_url || "/placeholder.svg"}
                  alt={bookToSave.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{bookToSave?.title}</h3>
              {bookToSave?.authors?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  by {bookToSave.authors.join(", ")}
                </p>
              )}
              {bookToSave?.publishers?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {bookToSave.publishers[0]} • {bookToSave.publish_date}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>Add to Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
