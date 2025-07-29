import { useEffect, useState } from "react";
import axios from "axios";
import type { book } from "./Interfaces";
import { useSelector } from "react-redux";
import type { RootState } from "../Store/store";
interface fetchState {
  url: string;
  page: number;
 
}
const useFetchData = ({ url, page }: fetchState) => {
  const { filters } = useSelector((state: RootState) => state.filteredBooks);
  const [data, setData] = useState<book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const category = filters.category === "All Tiers" ? "" : filters.category.toLowerCase();
  console.log(`URL is: ${url}/?page=${page}&search=${filters.category}`);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData([]); // reset before fetch starts

      try {
        const response = await axios.get(`${url}/?page=${page}&search=${category}`);
        setData(response.data.results);
      } catch (err: any) {
        console.error("Failed to fetch books", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filters.category, url]);

  return { data, loading, error };
};


export default useFetchData;
