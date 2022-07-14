import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { HomeRequest } from "../lib/types";

export const useRequests = () => {
  const { data, error, mutate } = useSWR("/api/request", fetcher);
  return {
    requests: data as HomeRequest[],
    isLoading: !error && !data,
    isError: error,
    mutateRequests: mutate,
  };
};
