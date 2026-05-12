type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
  onChange: (value: string) => void;
};

export function FormField({ id, label, value, error, required, type = "text", as = "input", children, onChange }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const shared = {
    id,
    name: id,
    value,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(event.target.value),
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
      {as === "textarea" ? <textarea {...shared} rows={6} /> : null}
      {as === "select" ? <select {...shared}>{children}</select> : null}
      {as === "input" ? <input {...shared} type={type} /> : null}
      {error ? <p className="field-error" id={describedBy}>{error}</p> : null}
    </div>
  );
}
