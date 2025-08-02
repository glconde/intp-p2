import { X } from "lucide-react";
import { ReactNode } from "react";
interface IFormModal {
  children: React.ReactNode;
  form: boolean;
  setForm: (value: boolean) => void;
  setId: (value: number | null) => void;
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
