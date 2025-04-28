"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CalendarIcon, Image } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useBooks } from "@/hooks/useBooks";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BookStatus } from "@/types/book";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { format, parseISO } from "date-fns";

const bookTypes = ["PAPERBACK", "HARDCOVER", "E_BOOK", "AUDIOBOOK"];

const bookStatuses = ["TO_READ", "READING", "COMPLETE", "PAUSED", "DROPPED"];

export default function EditBook() {
  const { id } = useParams<{ id: string }>();
  const { push } = useRouter();
  const { getBookById, updateBook } = useBooks();
  const { token } = useAuthContext();

  const [dateStarted, setDateStarted] = useState<Date>();
  const [dateFinished, setDateFinished] = useState<Date>();
  const [loved, setLoved] = useState(false);

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!token || !id) return null;
      const data = await getBookById({ token, book: id });
      if (data) {
        if (data.dateStarted) setDateStarted(new Date(data.dateStarted));
        if (data.dateFinished) setDateFinished(new Date(data.dateFinished));
        setLoved(data.loved);
      }
      return data;
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
      status: formData.get("status") as BookStatus,
      type: formData.get("type") as string,
      notes: formData.get("notes") as string,
      loved,
      dateStarted: dateStarted?.toISOString(),
      dateFinished: dateFinished?.toISOString(),
    };

    console.log("UPDATED BOOK", updatedBook);

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
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {book.coverUrl ? (
                <div className="flex-shrink-0">
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    className="w-32 h-auto object-cover rounded-md shadow-md"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 flex items-center justify-center w-32 h-44 bg-muted rounded-md">
                  <Image className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">Edit Book</h1>
                <p className="text-muted-foreground">
                  Update the information for &quot;{book.title}&quot;
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={book?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={book?.subtitle || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPages">Number of Pages</Label>
                <Input
                  id="numberOfPages"
                  name="numberOfPages"
                  type="number"
                  defaultValue={book?.numberOfPages}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn13">ISBN13</Label>
                <Input
                  id="isbn13"
                  name="isbn13"
                  defaultValue={book?.isbn13 || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={book?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ").toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Book type</Label>
                <Select name="type" defaultValue={book?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ").toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={book?.notes || ""}
                  className="min-h-[100px]"
                  maxLength={255}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="loved" checked={loved} onCheckedChange={setLoved} />
                <Label htmlFor="loved">Mark as Loved</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateStarted">Date Started</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateStarted && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateStarted ? (
                        format(
                          parseISO(book.publishDate.toString()),
                          "dd/MM/yyyy",
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateStarted}
                      onSelect={setDateStarted}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFinished">Date Finished</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFinished && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFinished ? (
                        format(dateFinished, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFinished}
                      onSelect={setDateFinished}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
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
