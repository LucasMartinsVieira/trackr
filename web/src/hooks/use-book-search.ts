import { useInfiniteQuery } from "@tanstack/react-query";
import { searchBooks } from "@/lib/api/books";

export function useBookSearch({
  query,
  searchType,
  enabled = false,
}: {
  query: string;
  searchType: string;
  enabled?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: ["searchBooks", query, searchType],
    queryFn: ({ pageParam = 1 }) =>
      searchBooks({
        query,
        searchType,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalResults = lastPage.numFound || 0;
      const loadedResults = allPages.reduce(
        (count, page) => count + (page.docs?.length || 0),
        0,
      );
      return loadedResults < totalResults ? allPages.length + 1 : undefined;
    },
    enabled: enabled && query.trim() !== "",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
