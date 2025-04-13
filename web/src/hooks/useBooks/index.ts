interface ListBooksProps {
  token: string;
}

export function useBooks() {
  async function listBooks(props: ListBooksProps) {
    const { token: authorization } = props;

    const req = await fetch(`/api/books`, {
      method: "GET",
      headers: { authorization },
    });

    const res = await req.json();

    return res;
  }

  return { listBooks };
}
