interface Props {
  token: string;
}

interface PropsBookById extends Props {
  book: string;
}

type Author = {
  key: string;
};

export type ReadingStatus =
  | "READING"
  | "TO_READ"
  | "READ"
  | "PAUSED"
  | "DROPPED";

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

  return { listBooks, getBookById, addBook };
}
