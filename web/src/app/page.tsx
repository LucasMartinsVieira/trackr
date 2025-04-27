/* eslint-disable @next/next/no-html-link-for-pages */
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <div className="space-y-6 max-w-3xl">
        <Book className="h-20 w-20 text-primary mx-auto" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Track Your Reading Journey
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w[700px] mx-auto">
          Keep track of your books, set reading goals, and discover new titles
          to add to your collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <a href="/books">Browse Books</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/auth">Get started</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
