import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function EmptyBooks() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-muted-foreground text-lg">No books found</p>
      <Button
        onClick={() => push("/books/new")}
        variant="link"
        className="mt-2 text-primary"
        asChild
      >
        {"Add your first book"}
      </Button>
    </div>
  );
}
