import { useEffect, useState } from "react";
import axios from "axios";
import type { book } from "./Interfaces";
interface fetchState {
  url: string;
  page: number;
}
const useFetchData = ({ url, page }: fetchState) => {
  const [data, setData] = useState<book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/?page=${page}`);
        setData((prev) => [...prev, ...response.data.results]);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch books", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);
  return { data, loading, error };
};

export default useFetchData;
