interface Props {
  token: string;
}

interface PropsBookById extends Props {
  book: string;
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

  return { listBooks, getBookById };
}
