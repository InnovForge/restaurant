import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

const fetchSearchSuggestions = async (query) => {
  if (!query) return [];
  const res = await api.get("/v1/search-suggest", { params: { query } });
  console.log("res.data :>> ", res.data);
  return res.data.data;
};

export const useSearchSuggestions = (searchTerm) => {
  const [debouncedQuery] = useDebounce(searchTerm, 300);
  return useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () => fetchSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60,
  });
};
