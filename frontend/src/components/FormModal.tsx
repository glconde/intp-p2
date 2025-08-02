import { X } from "lucide-react";
import { ReactNode } from "react";
interface IFormModal {
    children:ReactNode;
    form:boolean;
    setForm:(value:boolean)=>void
    setId:(value:unknown)=>void
}

const FormModal = ({children, form, setForm, setId}:IFormModal) => {
    return(
        <>
        <div className="tint"></div>
    <div className="form-modal">
        <div className="form-modal-header"><span></span><span onClick={()=>{setForm(!form); setId(null); }}><X /></span></div>
        {children}
    </div>
    </>
    )
}

export default FormModal;