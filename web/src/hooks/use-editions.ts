import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchEditions } from "@/lib/api/books";

export function useEditions({
  workId,
  enabled = false,
}: {
  workId: string;
  enabled?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: ["editions", workId],
    queryFn: ({ pageParam = 1 }) =>
      fetchEditions({
        workId,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalEditions = lastPage.size || 0;
      const loadedEditions = allPages.reduce(
        (count, page) => count + (page.entries?.length || 0),
        0,
      );
      return loadedEditions < totalEditions ? allPages.length + 1 : undefined;
    },
    enabled: enabled && !!workId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
