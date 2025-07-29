import { useEffect, useState } from "react";
import type { book } from "./Interfaces";
import axios from "axios";

interface BookState{
    id:number
}
const useFetchSingleBook = ({id}:BookState) => {
  const [book, setBook] = useState<book | null>(null);
  const [loading,setLoading]=useState<boolean>(true)
  const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchData=async ()=>{
            try{
                
                const response =await axios.get(`https://gutendex.com/books/${id}`)
                setBook(response.data)
            }
            catch(err:any){
                setError(err.emsaage)
            }
            finally{
                setLoading(false)
            }


        }
        fetchData()
    },[id])
    return { book, loading, error };
}

export default useFetchSingleBook