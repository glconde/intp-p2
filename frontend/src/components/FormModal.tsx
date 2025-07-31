import { X } from "lucide-react";
interface IFormModal {
    children:never;
    form:boolean;
    setForm:(value:boolean)=>void
    setId:(value:unknown)=>void
}

const FormModal = ({children, form, setForm, setId}:IFormModal) => {
    return(
    <div className="form-modal">
        <div className="form-modal-header"><span></span><span onClick={()=>{setForm(!form); setId(null); }}><X /></span></div>
        {children}
    </div>)
}

export default FormModal;