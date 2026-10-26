
const AuthSubmitButton = ({
    loading,
    loadingText,
    children,
    className,
}) => {
    return (
        <button
            className={className}
            type="submit"
            disabled={loading}
        >
            {loading ? loadingText : children}
        </button>
    );
};

export default AuthSubmitButton;
