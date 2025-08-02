'use client'
import Link from "next/link";
import { Clapperboard } from "lucide-react"
import { useAuth } from "@/services/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import MenuSearch from "./MenuSearch";
import { useRouter, usePathname } from "next/navigation";
import { IPageLink } from "@/services/types";
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
                <PageLink path="/" title="Home"/>
                {user && <><PageLink path="/dashboard" title="Dashboard"/> <Link onClick={handleLogout} href="#">Logout</Link></>}
                {!user && <PageLink path="/login" title="Login"/>}
            </div>
        </nav>
    )
}

const PageLink = ({path,title}:IPageLink) => {
    const pn = usePathname()
    return(
        <Link href={path} className={`${pn === path ? "active": ""}`}>{title}</Link>
    )
}

export default Menu;