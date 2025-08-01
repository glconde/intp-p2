'use client'
import Link from "next/link";
import { Clapperboard } from "lucide-react"
import { useAuth } from "@/services/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import MenuSearch from "./MenuSearch";
import { useRouter } from "next/navigation";
const Menu = () => {
    const router = useRouter()
    const { user } = useAuth()

    const handleLogout = async () => {
        try{
        await signOutUser()
        alert('You are signed out');
            router.replace('/')
        }catch(error){
            alert('Error signing out')
        }
    }

    return(
        <nav className="menu-bar">
            <div className="menu-logo">
                <Clapperboard size={20}/>
                MovieBank
                <MenuSearch />
            </div>
            
            <div className="menu-links">
                <Link href="/">Home</Link>
                {user && <><Link href="/dashboard">Dashboard</Link> <a onClick={handleLogout} href="#">Logout</a></>}
                {!user && <Link href="/login">Login</Link>}
            </div>
        </nav>
    )
}

export default Menu;