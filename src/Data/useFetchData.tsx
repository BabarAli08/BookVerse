import { useEffect, useState } from "react";
import axios from "axios";
import type { book } from "./Interfaces";
import { useSelector } from "react-redux";
import type { RootState } from "../Store/store";

interface fetchState {
  url: string;
  page: number;
  searchTerm:string
}

const useFetchData = ({ url, page,searchTerm }: fetchState) => {
  const { filters } = useSelector((state: RootState) => state.filteredBooks);
  const [data, setData] = useState<book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const category =
    filters.category === "All Tiers" ? "" : filters.category.toLowerCase();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${url}/?page=${page}&category=${category}&search=${searchTerm}`
        );
        setData(response.data.results);
        console.log("data After search", data);
      } catch (err: any) {
        console.error("Failed to fetch books", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchData(); 
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [page, category, url, searchTerm]);

  
  return { data, loading, error, };
};

export default useFetchData;
