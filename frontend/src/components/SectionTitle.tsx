import { Film } from "lucide-react";

interface ISectionTitle {
    title:string;
}

const SectionTitle = ({title}:ISectionTitle) => {
    return(
        <div className="section-title"><Film size={25} color="#999999"/>{title}</div>
    )
}

export default SectionTitle