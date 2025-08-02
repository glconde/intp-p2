import { X } from "lucide-react";
interface IFormModal {
  children: React.ReactNode;
  form: boolean;
  setForm: (value: boolean) => void;
  setId: (value: number | null) => void;
  getMovies: () => void;
}

const FormModal = ({ children, form, setForm, setId }: IFormModal) => {
  return (
    <div className="form-modal">
      <div className="form-modal-header">
        <span></span>
        <span
          onClick={() => {
            setForm(false);
            setId(null);
          }}
        >
          <X />
        </span>
      </div>
      {children}
    </div>
  );
};

export default FormModal;
