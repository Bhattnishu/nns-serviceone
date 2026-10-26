import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                navigate("/login", {
                    replace: true,
                    state: {
                        message: "Please log in to view your profile.",
                    },
                });
                return;
            }

            try {
                const response = await api.get("/auth/me/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setUser(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load your profile. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <main className="profile-page">
                <section className="profile-state">
                    <p>Loading your profile...</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="profile-page">
                <section className="profile-state">
                    <h1>My Profile</h1>
                    <p className="profile-error" role="alert">
                        {error}
                    </p>
                    <button
                        className="profile-primary-button"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>
                </section>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const addressParts = [
        user.address,
        user.area,
        user.city,
        user.state,
        user.pincode,
    ].filter(Boolean);

    const savedAddress = addressParts.join(", ");

    const personalFields = [
        { label: "Full name", value: user.name },
        { label: "Email address", value: user.email },
        { label: "Phone number", value: user.phone },
    ];

    return (
        <main className="profile-page">
            <div className="profile-container">
                <div className="profile-topbar">
                    <div>
                        <p className="profile-eyebrow">YOUR ACCOUNT</p>
                        <h1>My Profile</h1>
                        <p className="profile-subtitle">
                            Manage your personal information and saved address.
                        </p>
                    </div>

                    <div className="profile-avatar">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>

                <section className="profile-section">
                    <div className="profile-section-heading">
                        <div className="profile-section-icon">♙</div>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Your account details</p>
                        </div>
                    </div>

                    <div className="profile-fields">
                        {personalFields.map((field) => (
                            <div className="profile-field" key={field.label}>
                                <div className="profile-field-content">
                                    <span className="profile-field-label">
                                        {field.label}
                                    </span>
                                    <p>
                                        {field.value || "Not provided"}
                                    </p>
                                </div>

                                <span
                                    className="profile-edit-icon"
                                    aria-hidden="true"
                                    title="Editing will be available soon"
                                >
                                    ✎
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="profile-section">
                    <div className="profile-section-heading">
                        <div className="profile-section-icon">⌖</div>
                        <div>
                            <h2>Saved Address</h2>
                            <p>Your default service location</p>
                        </div>
                    </div>

                    <div className="profile-address">
                        <div className="profile-address-icon">⌖</div>

                        <div className="profile-field-content">
                            <span className="profile-field-label">
                                Home Address
                            </span>

                            <p>
                                {savedAddress ||
                                    "No saved address yet. Add one to make future bookings easier."}
                            </p>

                            <span className="profile-address-note">
                                You can use a different address for each booking.
                            </span>
                        </div>

                        <span
                            className="profile-edit-icon"
                            aria-hidden="true"
                            title="Editing will be available soon"
                        >
                            ✎
                        </span>
                    </div>
                </section>

                <section className="profile-section">
                    <div className="profile-section-heading">
                        <div className="profile-section-icon">↗</div>
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Manage your ServiceOne activity</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <div className="profile-action">
                            <div className="profile-action-icon">▣</div>
                            <div>
                                <h3>My Bookings</h3>
                                <p>View your service requests and their status.</p>
                            </div>
                            <span className="profile-action-arrow">→</span>
                        </div>

                        <button
                            type="button"
                            className="profile-action profile-action-button"
                            onClick={() => navigate("/offer-service")}
                        >
                            <div className="profile-action-icon">＋</div>
                            <div>
                                <h3>Offer Services</h3>
                                <p>Start your journey as a service provider.</p>
                            </div>
                            <span className="profile-action-arrow">→</span>
                        </button>
                    </div>
                </section>

                <button
                    type="button"
                    className="profile-home-link"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>
        </main>
    );
};

export default Profile;
