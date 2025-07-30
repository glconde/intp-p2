'use client'

const MenuSearch = () => {

    const handleSearch = (e:unknown) => {

    }

    return(
        <>
        <input type="search" onChange={handleSearch} placeholder="Search for movies" className="search"/>
        </>
    )
}

export default MenuSearch