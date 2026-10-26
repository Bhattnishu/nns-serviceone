const AuthField = ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    autoComplete,
    className,
}) => {
    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>

            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required
            />
        </div>
    );
};

export default AuthField;
