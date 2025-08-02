'use client'
import { signInWithGoogle } from "@/lib/firebase/auth"
import { useAuth } from "@/services/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Google from '../../public/google.svg'

const Login = () => {

    const { user, loading} = useAuth()
    const router = useRouter()

     useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

    const handleLogin = async () => {
        try{
            const googlesignin = await signInWithGoogle()
            if(user){
                router.push('/dashboard')
            }
        }catch(error){
            alert('Error')
        }
    }
    return(
        <div className="login-wrapper"><button onClick={handleLogin}><Image src={Google} alt="" />Sign in with google</button></div>
    )
}

export default Login