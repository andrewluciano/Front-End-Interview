import { QueryClient, QueryCache } from "react-query";
import toast from "react-hot-toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(`Something went wrong: ${error.message}`),
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
