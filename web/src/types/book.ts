interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: true;
  unpaged: false;
}

export type BookStatus =
  | "TO_READ"
  | "READING"
  | "COMPLETE"
  | "PAUSED"
  | "DROPPED";

type BookType = "PAPERBACK" | "HARDCOVER" | "E_BOOK" | "AUDIOBOOK";

export interface ListBookContent {
  id: string;
  authors: string[];
  coverUrl: string;
  dateFinished: Date;
  dateStated: Date;
  isbn10: string;
  isbn13: string;
  loved: boolean;
  openLibraryId: string;
  publishDate: Date;
  publishers: string[];
  status: BookStatus;
  subtitle: "string";
  title: "string";
  type: BookType;
  userRating: number | null;
  notes: string | null;
}

export interface ListBooksUseQueryInterface {
  content: ListBookContent[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
