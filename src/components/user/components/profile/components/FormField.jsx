"use client"


const FormField = ({ label, name, type = "text", value, onChange, placeholder, error, disabled = false }) => {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? "input-error" : ""}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default FormField

