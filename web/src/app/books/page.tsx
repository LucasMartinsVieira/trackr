"use client";

import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyBooks } from "@/components/Books/empty-books";
import { BooksList } from "@/components/Books/books-list";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBooks } from "@/hooks/useBooks";
import { useQuery } from "@tanstack/react-query";
import { BookStatus, ListBooksUseQueryInterface } from "@/types/book";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookStatus>("COMPLETE");
  const [currentPage, setCurrentPage] = useState(1);
  const { listBooks } = useBooks();
  const { push } = useRouter();

  const fetchBooks = async () => {
    const books = await listBooks({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0cmFja3ItYXBpIiwic3ViIjoibHVjYXNAZW1haWwuY29tIiwiZXhwIjoxNzQ0NTk1Mjg3fQ.YJHO2CN-JPhdo4Zbq7LDPRzcukuIqbByDBiyJkFUlyo",
    });

    return books;
  };

  const { data, isLoading, isError, error, refetch } =
    useQuery<ListBooksUseQueryInterface>({
      queryFn: fetchBooks,
      queryKey: ["books"],
      refetchOnWindowFocus: false,
      retry: false,
    });

  useMemo(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const getPageNumbers = () => {
    if (!data) return [];

    const pageNumbers = [];

    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push("ellipsis1");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(data.totalPages - 1, data.number + 1);
      i++
    ) {
      if (i === 1 || i === data.totalPages) continue;
      pageNumbers.push(i);
    }

    if (currentPage < data.totalPages - 2) {
      pageNumbers.push("ellipsis2");
    }

    if (data.totalPages > 1) {
      pageNumbers.push(data.totalPages);
    }

    return pageNumbers;
  };

  const BookListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-md">
          <Skeleton className="h-24 w-16 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container py-8 pl-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">My Books </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                className="w-full sm:w-[250px] pl-8 "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter My Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "COMPLETE"}
                  onCheckedChange={() => setStatusFilter("COMPLETE")}
                >
                  Completed
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={statusFilter === "READING"}
                  onCheckedChange={() => setStatusFilter("READING")}
                >
                  Reading
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={statusFilter === "TO_READ"}
                  onCheckedChange={() => setStatusFilter("TO_READ")}
                >
                  To Read
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={statusFilter === "PAUSED"}
                  onCheckedChange={() => setStatusFilter("PAUSED")}
                >
                  Paused
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={statusFilter === "DROPPED"}
                  onCheckedChange={() => setStatusFilter("DROPPED")}
                >
                  Dropped
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              asChild
              onClick={() => push("/books/new")}
            >
              <span>
                <Plus className="mr-2 h-4 w-4" />
                {"Add Book"}
              </span>
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="complete"
          className="w-full"
          onValueChange={(value) => {
            if (value === "complete") setStatusFilter("COMPLETE");
            else if (value === "reading") setStatusFilter("READING");
            else if (value === "to-read") setStatusFilter("TO_READ");
            else if (value === "paused") setStatusFilter("PAUSED");
            else if (value === "dropped") setStatusFilter("DROPPED");
            setCurrentPage(1);
          }}
          value={
            statusFilter === "COMPLETE"
              ? "complete"
              : statusFilter === "READING"
                ? "reading"
                : statusFilter === "TO_READ"
                  ? "to-read"
                  : statusFilter === "PAUSED"
                    ? "paused"
                    : "dropped"
          }
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="complete">Completed</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="to-read">To Read</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="dropped">Dropped</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {isLoading ? (
              <BookListSkeleton />
            ) : isError ? (
              <div className="py-12 text-center">
                <p className="text-red-500">
                  Error loading books: {(error as Error).message}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : data?.content.length === 0 ? (
              <EmptyBooks />
            ) : (
              <BooksList books={data?.content || []} />
            )}
          </div>
        </Tabs>

        {data && data.totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationPrevious>
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis1" || page === "ellipsis2" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page as number);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < data.totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {data && (
          <div className="text-center text-sm text-muted-foreground">
            Showing{" "}
            {data.content.length > 0
              ? `${data.pageable.pageNumber * data.pageable.pageSize + 1} to 
              ${data.totalPages} of 
              ${data.totalElements}`
              : "0"}{" "}
            books
          </div>
        )}
      </div>
    </div>
  );
}
