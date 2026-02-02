import { useState } from "react";
import { toast } from "sonner";
export const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    console.log("args", ...args);
    try {
      const response = await cb(...args);
      console.log("resposne", response)
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      console.log("error", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};
