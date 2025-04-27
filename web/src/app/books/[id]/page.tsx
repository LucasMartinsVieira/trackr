"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from "@/hooks/useBooks";
import { ListBookContent } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Heart, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { parseISO, format, differenceInDays } from "date-fns";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function BookDetailPage() {
  const { push } = useRouter();
  const { id } = useParams<{ id: string }>();
  const { getBookById } = useBooks();

  const { token } = useAuthContext();

  const fetchBookById = async () => {
    if (!token) return;
    const book = getBookById({
      token,
      book: id,
    });
    return book;
  };

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery<ListBookContent>({
    queryFn: fetchBookById,
    queryKey: ["book", id],
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id && !!token, // only fetch if id and token are available
  });

  let readingDuration = null;
  if (book?.dateStated && book.dateFinished) {
    readingDuration = differenceInDays(book.dateFinished, book.dateStated);
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
            onClick={() => push("/books")}
          >
            <p className="flex items-center gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Books
            </p>
          </Button>
          <Skeleton className="h-10 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <Skeleton className="aspect-[2/3] w-full" />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-6 mx-0.5" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Error state
  if (isError) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
            onClick={() => push("/books")}
          >
            <p className="flex items-center gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Books
            </p>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Book
          </h2>
          <p className="text-muted-foreground mb-6">
            {(error as Error)?.message || "Failed to load book details"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
            onClick={() => push("/books")}
          >
            <p className="flex items-center gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Books
            </p>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The book you are looking for does not exist or has been removed.
          </p>
          <Button asChild onClick={() => push("/books")}>
            <p>Browse Books</p>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 pl-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4"
          onClick={() => push("/books")}
        >
          <p className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </p>
        </Button>
        <h1 className="text-3xl font-bold">{book.title}</h1>
        {book.subtitle && (
          <p className="text-xl text-muted-foreground">{book.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 relative p-1">
            <CardContent className="px-1 py-1">
              <div className="relative">
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full object-cover"
                  style={{ aspectRatio: "2/3" }}
                />
                {book.loved && (
                  <div className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full shadow-md">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {book.userRating && (
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(book.userRating!)
                      ? "fill-primary text-primary"
                      : i < book.userRating!
                        ? "fill-primary text-primary" // For half stars, we'd need a custom component
                        : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Authors
              </p>
              <p>{book.authors.join(", ")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Publish Date
              </p>
              <p>
                {book.publishDate
                  ? format(parseISO(book.publishDate.toString()), "dd/MM/yyyy")
                  : "Not informed"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Book Type
              </p>
              <p>{book.type.replace("_", " ").toLowerCase()}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                className={`${
                  book.status === "COMPLETE"
                    ? "bg-green-100 text-green-800"
                    : book.status === "READING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {book.status.replace("_", " ").toLowerCase()}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Number of Pages
              </p>
              <p>{book.numberOfPages}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ISBN</p>
              <p>{book.isbn13 ? book.isbn13 : "Not informed"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                OpenLibrary ID
              </p>
              <p>{book.openLibraryId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Loved</p>
              <div className="flex items-center">
                {book.loved ? (
                  <>
                    <Heart className="h-4 w-4 text-red-500 fill-red-500 mr-1.5" />
                    <span>Yes</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 text-muted-foreground mr-1.5" />
                    <span>No</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {book.status === "COMPLETE" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reading Journey</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Started
                      </p>
                      <p>
                        {book.dateStated
                          ? format(
                              parseISO(book.dateStated.toString()),
                              "dd/MM/yyyy",
                            )
                          : "Not informed"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Finished
                      </p>
                      <p>
                        {book.dateFinished
                          ? format(
                              parseISO(book.dateFinished.toString()),
                              "dd/MM/yyyy",
                            )
                          : "Not informed"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Duration
                      </p>
                      <p>{readingDuration} days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
