
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import MyServiceCard from "./MyServiceCard";
import EditServiceModal from "./EditServiceModal";

import "./MyServices.css";

function MyServices() {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingService, setEditingService] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formError, setFormError] = useState("");

    // Fetch provider services
    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/providers/services/my/");
            const data = response.data;

            setServices(
                Array.isArray(data) ? data : data.results || []
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not load your services. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Open edit modal
    const handleEditClick = (service) => {
        setFormError("");

        setEditingService({
            id: service.id,
            service_name: service.service_name || "",
            description: service.description || "",
            price: service.price || "",
        });
    };

    // Close edit modal
    const handleCloseEdit = () => {
        if (saving) return;

        setEditingService(null);
        setFormError("");
    };

    // Update service
    const handleUpdate = async (event) => {
        event.preventDefault();

        if (
            !editingService.service_name.trim() ||
            !editingService.description.trim() ||
            !editingService.price
        ) {
            setFormError("Please fill in all fields.");
            return;
        }

        const price = Number(editingService.price);

        if (!Number.isFinite(price) || price <= 0) {
            setFormError("Please enter a valid price.");
            return;
        }

        try {
            setSaving(true);
            setFormError("");

            await api.patch(
                `/providers/services/${editingService.id}/`,
                {
                    service_name: editingService.service_name.trim(),
                    description: editingService.description.trim(),
                    price: editingService.price,
                }
            );

            setEditingService(null);
            await fetchServices();
        } catch (err) {
            const data = err.response?.data;

            setFormError(
                data?.detail ||
                data?.service_name?.[0] ||
                data?.description?.[0] ||
                data?.price?.[0] ||
                "Could not update this service. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete service
    const handleDelete = async (service) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${service.service_name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(service.id);
            setError("");

            await api.delete(`/providers/services/${service.id}/`);

            setServices((previous) =>
                previous.filter((item) => item.id !== service.id)
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not delete this service. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // Service status label
    const getStatusLabel = (status) => {
        const labels = {
            APPROVED: "Approved",
            PENDING: "Pending",
            REJECTED: "Declined",
        };

        return labels[status] || status || "Unknown";
    };

    // Service visibility message
    const getVisibilityMessage = (status) => {
        const messages = {
            APPROVED: "Visible to customers",
            PENDING: "Waiting for admin approval · Hidden from customers",
            REJECTED: "Not approved · Hidden from customers",
        };

        return messages[status] || "";
    };

    return (
        <div className="my-services-page">
            <div className="my-services-container">

                {/* Page Header */}
                <div className="my-services-header">
                    <div>
                        <h1>My Services</h1>
                        <p>Manage the services you offer on ServiceOne.</p>
                    </div>

                    <div className="my-services-header-actions">
                        <span className="my-services-count">
                            {services.length}{" "}
                            {services.length === 1 ? "Service" : "Services"}
                        </span>

                        <button
                            type="button"
                            className="add-service-btn"
                            onClick={() => navigate("/offer-service")}
                        >
                            + Add New Service
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="my-services-error">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchServices}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Services Content */}
                {loading ? (
                    <div className="my-services-message">
                        Loading your services...
                    </div>
                ) : services.length === 0 ? (
                    <div className="my-services-empty">
                        <h2>No Services Yet</h2>

                        <p>
                            You haven't added any services.
                            Start offering your services on ServiceOne.
                        </p>
                    </div>
                ) : (
                    <div className="my-services-grid">
                        {services.map((service) => (
                            <MyServiceCard
                                key={service.id}
                                service={service}
                                getStatusLabel={getStatusLabel}
                                getVisibilityMessage={getVisibilityMessage}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                                deletingId={deletingId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Service Modal */}
            {editingService && (
                <EditServiceModal
                    editingService={editingService}
                    setEditingService={setEditingService}
                    onClose={handleCloseEdit}
                    onSubmit={handleUpdate}
                    saving={saving}
                    error={formError}
                />
            )}
        </div>
    );
}

export default MyServices;
