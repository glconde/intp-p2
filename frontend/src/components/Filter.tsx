import { ListFilterPlus, X } from "lucide-react"
import { useState } from 'react'
import { IMovie } from "@/services/types"

interface IFiltered {
    setFiltered:(value:IMovie[] | null) => void;
    filtered:IMovie[]
}

const filters = ['action','adventure','sci-fi','documentary','horror','fantasy','crime','thriller','historical','biography','animation','family','martial arts','sports','superhero']
const Filter = ({setFiltered, filtered}:IFiltered) => {
    const [filter, setFilter] = useState<boolean>(false)
    const [value, setValue] = useState<string | null>(null)
    

    const handleFilter = (val:string) => {
        setValue(val)
        const fil = filtered?.filter((item: IMovie) => item.genre.toLowerCase().includes(val));
        setFiltered(fil)
        setFilter(!filter)
    }

    const closeFilter = () => {
        setFiltered(null); 
        setValue(null); 
        if(filter) setFilter(!filter);
    }
    return(
        <div className="filter-wrapper">
        <button type="button" className="filter-button" onClick={()=>setFilter(!filter)}><ListFilterPlus/>Filters</button>
        {value && <>{value} <button className="filter-button" onClick={closeFilter}><X/></button></> }
        { filter && <div className="filters">
            {filters.map((f,i)=>(<div key={i} className={`filter ${f === value && `active-filter`}`} onClick={()=>handleFilter(f)}>{f}</div>))}
            </div>}
        </div>
    )
}

export default Filter