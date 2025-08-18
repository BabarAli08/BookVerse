import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import supabase from "../../supabase-client"

const Profile = () => {
  const [user,setUser]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  const navigate=useNavigate()
  useEffect(()=>{
    const getUser=async ()=>{
      setLoading(true)
      const {data,error}=await supabase.auth.getUser()
      if(error){
        alert("login to see the books in your library ")
        navigate('/login')
        return 
      }else{
        setUser(data.user)
        setLoading(false)
      }
    }
    getUser()
  },[])

  console.log("user is ",user)
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[75%] h-[100%] flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-4 w-full h-[25%] from-purple-500 to-blue-600">
            
            </div>
        </div>
    </div>
  )
}

export default Profile