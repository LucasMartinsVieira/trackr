import { BookStatus } from "@/types/book";

interface Props {
  token: string;
}

interface PropsBookById extends Props {
  book: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Author = {
  key: string;
};

export type ReadingStatus =
  | "READING"
  | "TO_READ"
  | "READ"
  | "PAUSED"
  | "DROPPED";

export type BookTypes = "PAPERBACK" | "HARDCOVER" | "E_BOOK" | "AUDIOBOOK";

interface PropsAddBook extends Props {
  openLibraryId: string;
  title: string;
  subtitle: string;
  authors: string[];
  publish_date: string;
  cover_url: string;
  isbn_10: string;
  isbn_13: string;
  number_of_pages: number;
  publishers: string[];
  reading_status: ReadingStatus;
}

interface PropsUpdateBook extends Props {
  title: string;
  subtitle: string;
  numberOfPages: number;
  isbn13: string;
  status: BookStatus;
  type: BookTypes;
  notes: string;
  loved: boolean;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
}

export function useBooks() {
  async function listBooks(props: Props) {
    const { token: authorization } = props;

    const req = await fetch(`/api/books`, {
      method: "GET",
      headers: { authorization },
    });

    const res = await req.json();

    return res;
  }

  async function getBookById(props: PropsBookById) {
    const { token: authorization, book } = props;

    const req = await fetch(`/api/book/?bookId=${book}`, {
      method: "GET",
      headers: { authorization },
    });

    const res = await req.json();

    return res;
  }

  async function addBook(props: PropsAddBook) {
    const { token: authorization } = props;

    const req = await fetch(`/api/books`, {
      method: "POST",
      headers: { authorization },
      body: JSON.stringify({
        openLibraryId: props.openLibraryId,
        title: props.title,
        subtitle: props.subtitle,
        authors: props.authors,
        coverUrl: props.cover_url,
        isbn10: props.isbn_10,
        isbn13: props.isbn_13,
        numberOfPages: props.number_of_pages,
        publishers: props.publishers,
        publish_date: props.publish_date,
        notes: "",
        type: "PAPERBACK",
        status: props.reading_status,
      }),
    });

    const res = await req.json();

    return res;
  }

  async function updateBook(id: string, props: PropsUpdateBook) {
    const { token: authorization } = props;

    const req = await fetch(`/api/books?bookId=${id}`, {
      method: "PUT",
      headers: { authorization },
      body: JSON.stringify({
        title: props.title,
        subtitle: props.subtitle,
        isbn13: props.isbn13,
        numberOfPages: props.numberOfPages,
        notes: props.notes,
        type: props.type,
        status: props.status,
        dateFinished: props.dateStarted,
        dateStarted: props.dateStarted,
        loved: props.loved,
      }),
    });

    const res = await req.json();

    return res;
  }

  async function changeBookStatus(id: string, props: Props) {
    const { token: authorization } = props;

    const req = await fetch(`/api/books?bookId=${id}`, {
      method: "PATCH",
      headers: { authorization },
    });

    const res = await req.json();

    return res;
  }

  return { listBooks, getBookById, addBook, updateBook, changeBookStatus };
}
