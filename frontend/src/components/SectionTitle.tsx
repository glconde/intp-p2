import { Film } from "lucide-react";

interface ISectionTitle {
    title:string;
}

const SectionTitle = ({title}:ISectionTitle) => {
    return(
        <div className="section-title"><Film size={20}/>{title}</div>
    )
}

export default SectionTitle