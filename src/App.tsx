import Navbar from "./Component/Navbar/Navbar"
import { Outlet } from "react-router-dom"
import useFetchData from "./Data/useFetchData"

function App() {


  return (
    <>
    <Navbar/>
    <Outlet />
   
    </>
  )
}

export default App
