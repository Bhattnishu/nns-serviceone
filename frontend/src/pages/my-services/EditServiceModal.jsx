
import "./EditServiceModal.css";

const EditServiceModal = ({
    editingService,
    setEditingService,
    onClose,
    onSubmit,
    saving,
    error,
}) => {
    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditingService((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    return (
        <div
            className="edit-service-overlay"
            onClick={onClose}
        >
            <div
                className="edit-service-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="edit-service-modal-header">
                    <h2>Edit Service</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close edit form"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <label htmlFor="service_name">
                        Service Name
                    </label>

                    <input
                        id="service_name"
                        name="service_name"
                        value={editingService.service_name}
                        onChange={handleChange}
                    />

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={editingService.description}
                        onChange={handleChange}
                    />

                    <label htmlFor="price">
                        Price (₹)
                    </label>

                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editingService.price}
                        onChange={handleChange}
                    />

                    {error && (
                        <p className="edit-service-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="edit-service-form-actions">
                        <button
                            type="button"
                            className="cancel-edit-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-edit-btn"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
