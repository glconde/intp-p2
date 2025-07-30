import { Clapperboard } from "lucide-react"
import MenuSearch from "./MenuSearch";
const Menu = () => {
    return(
        <nav className="menu-bar">
            <div className="menu-logo">
                <Clapperboard size={20}/>
                MovieBank
            </div>
            <MenuSearch />
            <div className="menu-links"></div>
        </nav>
    )
}

export default Menu;