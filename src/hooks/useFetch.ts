import { useState } from "react";
import { toast } from "sonner";

type UseFetchOptions<TData, TArgs extends unknown[]> = {
  cb: (...args: TArgs) => Promise<TData>;
};

function useFetch<TData, TArgs extends unknown[]>({
  cb,
}: UseFetchOptions<TData, TArgs>) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}

export default useFetch;
