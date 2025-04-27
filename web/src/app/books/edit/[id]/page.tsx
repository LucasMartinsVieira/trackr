"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useBooks } from "@/hooks/useBooks";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function EditBook() {
  const { id } = useParams<{ id: string }>();
  const { push } = useRouter();
  const { getBookById, updateBook } = useBooks();
  const { token } = useAuthContext();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!token || !id) return null;
      return getBookById({ token, book: id });
    },
    enabled: !!token && !!id,
  });

  console.log(book);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !id) return;

    const formData = new FormData(e.currentTarget);
    const updatedBook = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      numberOfPages: parseInt(formData.get("numberOfPages") as string),
      isbn13: formData.get("isbn13") as string,
    };

    try {
      await updateBook({
        token,
        bookId: id,
        ...updatedBook,
      });
      toast.success("Book updated successfully");
      push(`/books/${id}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update book");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Button onClick={() => push("/books")} className="mt-4">
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => push(`/books/${id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Book Details
          </Button>

          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={book.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={book.subtitle || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPages">Number of Pages</Label>
                <Input
                  id="numberOfPages"
                  name="numberOfPages"
                  type="number"
                  defaultValue={book.numberOfPages}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn13">ISBN13</Label>
                <Input
                  id="isbn13"
                  name="isbn13"
                  defaultValue={book.isbn13 || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" name="status" defaultValue={book.status} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Book type</Label>
                <Input id="type" name="type" defaultValue={book.type || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  defaultValue={book.notes || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loved">Loved</Label>
                <Input id="loved" name="loved" defaultValue={book.loved} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateStarted">Date Started</Label>
                <Input
                  id="dateStarted"
                  name="dateStarted"
                  defaultValue={book.dateStarted || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFinished">Date Finished</Label>
                <Input
                  id="dateFinished"
                  name="dateFinished"
                  defaultValue={book.dateFinished || ""}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => push(`/books/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
