/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { ListBookContent } from "@/types/book";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface Props {
  books: ListBookContent[];
}

export function BooksList({ books }: Props) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No books found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Link key={book.id} href={`/books/${book.id}`}>
          <Card className="overflow-hidden transition-all hover:border-primary">
            <CardContent className="p-4 flex gap-4">
              <div className="relative h-24 w-16 flex-shrink-0">
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
                {book.loved && (
                  <div className="absolute top-0 right-0 bg-red-500 p-1 rounded-bl-md">
                    <Heart className="h-3 w-3 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                    <Badge
                      className={cn(
                        "ml-2",
                        book.status === "COMPLETE"
                          ? "bg-green-600 hover:bg-green-600"
                          : book.status === "READING"
                            ? "bg-primary hover:bg-primary"
                            : "bg-blue-600 hover:bg-blue-600",
                      )}
                    >
                      {book.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.authors.join(", ")}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {new Date(book.publishDate).toLocaleDateString()}
                  </p>
                  {book.userRating != null ? (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < Math.floor(book.userRating!)
                              ? "fill-primary text-primary"
                              : i < book.userRating!
                                ? "fill-primary text-primary"
                                : "text-muted-foreground",
                          )}
                        />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground text-white">
                        {book.userRating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Not rated
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
