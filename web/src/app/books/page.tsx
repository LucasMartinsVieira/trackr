"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { ListBooksUseQueryInterface } from "@/types/book";
import { useAuthContext } from "@/components/providers/auth-provider";
import BookListSkeleton from "@/components/Books/book-list-skeleton";

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { listBooks } = useBooks();
  const { push } = useRouter();

  const { token, loading: authLoading } = useAuthContext();

  const fetchBooks = async () => {
    // if (!token) return;

    const books = await listBooks({
      token: token!,
    });

    return books;
  };

  const { data, isLoading, isError, error } =
    useQuery<ListBooksUseQueryInterface>({
      queryFn: fetchBooks,
      queryKey: ["books"],
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
    });

  useMemo(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) {
    return <BookListSkeleton />;
  }

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

  return (
    <div className="container py-8 pl-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">My Books </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
                {" "}
                Try Again{" "}
              </Button>{" "}
            </div>
          ) : data?.content.length === 0 ? (
            <EmptyBooks />
          ) : (
            <BooksList books={data?.content || []} />
          )}
        </div>

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
