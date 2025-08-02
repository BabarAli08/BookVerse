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

  const category =
    filters.category === "All Tiers" ? "" : filters.category.toLowerCase();
  const searchTerm = filters.search;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        
        const response = await axios.get(
          `${url}/?page=${page}&topic=${category}&search=${searchTerm}`
        );
        console.log(`${url}/?page=${page}&topic=${category}&search=${searchTerm}`, response.data.results);

        setData(response.data.results || []);
        console.log("data After search", response.data.results);
      } catch (err: any) {
        console.error("Failed to fetch books", err);
        setError("Something went wrong while fetching data.");
        setData([]); 
      } finally {
        setLoading(false);
      }
    };

   
    if (searchTerm || category) {
      const delayDebounce = setTimeout(fetchData, 2000);
      return () => clearTimeout(delayDebounce);
    } else {
     
      fetchData();
    }
  }, [category, url, searchTerm, page]);

  return { data, loading, error };
};

export default useFetchData;