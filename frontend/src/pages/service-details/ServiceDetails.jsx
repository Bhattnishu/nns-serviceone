
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import ServiceOverview from "../../components/service-overview/ServiceOverview";
import ServiceLocation from "../../components/service-location/ServiceLocation";
import ProviderSummary from "../../components/provider-summary/ProviderSummary";
import api from "../../api/axios";

import "./ServiceDetails.css";

const ServiceDetails = () => {
    const { providerId, serviceId } = useParams();
    const routeLocation = useLocation();

    const { isAuthenticated } = useAuth();

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(isAuthenticated);

    const [bookingOpen, setBookingOpen] = useState(false);
    const [bookingMessage, setBookingMessage] = useState("");
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const searchResultsUrl =
        routeLocation.state?.searchResultsUrl ||
        routeLocation.state?.returnTo ||
        "/services";

    const serviceDetailsUrl =
        `${routeLocation.pathname}${routeLocation.search}${routeLocation.hash}`;

    // Fetch provider details
    useEffect(() => {
        const fetchProvider = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `/discovery/providers/${providerId}/`
                );

                setProvider(response.data);
            } catch (error) {
                console.error("Failed to load service details:", error);
                setProvider(null);
                setError("Unable to load this service. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [providerId]);

    // Fetch logged-in user details
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!isAuthenticated) {
                setCurrentUser(null);
                setUserLoading(false);
                return;
            }

            setUserLoading(true);

            try {
                const response = await api.get("/auth/me/");
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Failed to load current user:", error);
                setCurrentUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentUser();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <main className="service-details-page">
                <p className="service-details-message" role="status">
                    Loading service details...
                </p>
            </main>
        );
    }

    if (error || !provider) {
        return (
            <main className="service-details-page">
                <p className="service-details-error" role="alert">
                    {error || "Provider not found."}
                </p>

                <Link to={searchResultsUrl} className="service-details-back">
                    <ArrowLeft size={16} />
                    Back to services
                </Link>
            </main>
        );
    }

    const service = provider.services?.find(
        (item) => String(item.id) === serviceId
    );

    if (!service) {
        return (
            <main className="service-details-page">
                <p className="service-details-error" role="alert">
                    This service could not be found for this provider.
                </p>

                <Link to={searchResultsUrl} className="service-details-back">
                    <ArrowLeft size={16} />
                    Back to services
                </Link>
            </main>
        );
    }

    // Identify the logged-in user and service provider
    const currentUserId = currentUser?.id ?? currentUser?.user?.id;

    const providerUserId =
        provider.user?.id ??
        provider.user_id ??
        provider.owner?.id;

    const isOwnService =
        currentUserId != null &&
        providerUserId != null &&
        String(currentUserId) === String(providerUserId);

    // Show booking button to authenticated customers
    const canBookService =
        isAuthenticated &&
        !userLoading &&
        !isOwnService;

    const hasPrice =
        service.price !== null &&
        service.price !== undefined &&
        String(service.price).trim() !== "" &&
        Number.isFinite(Number(service.price));

    const formattedPrice = hasPrice
        ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
          }).format(Number(service.price))
        : "Price not listed";

    const otherServices = (provider.services || []).filter(
        (item) => String(item.id) !== serviceId
    );

    // Submit booking request
    const handleBookingSubmit = async (event) => {
        event.preventDefault();

        setBookingSubmitting(true);
        setBookingError("");
        setBookingSuccess("");

        try {
            await api.post("/bookings/", {
                service: service.id,
                message: bookingMessage.trim(),
            });

            setBookingSuccess(
                "Your booking request has been sent successfully!"
            );

            setBookingMessage("");
            setBookingOpen(false);
        } catch (error) {
            console.error("Failed to submit booking:", error);

            const errorData = error.response?.data;

            const message =
                errorData?.detail ||
                errorData?.service?.[0] ||
                errorData?.non_field_errors?.[0] ||
                "Could not send your booking request. Please try again.";

            setBookingError(message);
        } finally {
            setBookingSubmitting(false);
        }
    };

    return (
        <main className="service-details-page">
            <Link to={searchResultsUrl} className="service-details-back">
                <ArrowLeft size={16} />
                Back to search results
            </Link>

            <div className="service-details-layout">

                <section className="service-details-main">
                    <ServiceOverview
                        service={service}
                        formattedPrice={formattedPrice}
                    />

                    {canBookService && (
                        <>
                            <button
                                type="button"
                                className="book-service-button"
                                onClick={() => {
                                    setBookingError("");
                                    setBookingMessage("");
                                    setBookingOpen(true);
                                }}
                            >
                                Book This Service
                            </button>

                            {bookingSuccess && (
                                <p
                                    className="booking-success"
                                    role="status"
                                >
                                    {bookingSuccess}
                                </p>
                            )}
                        </>
                    )}

                    {isOwnService && (
                        <p className="booking-info">
                            You cannot book your own service.
                        </p>
                    )}

                    <ServiceLocation provider={provider} />
                </section>

                <aside className="service-details-sidebar">
                    <ProviderSummary
                        provider={provider}
                        returnTo={serviceDetailsUrl}
                        searchResultsUrl={searchResultsUrl}
                    />

                    {otherServices.length > 0 && (
                        <div className="service-other-services">
                            <h3>Other services offered</h3>

                            {otherServices.map((otherService) => (
                                <Link
                                    key={otherService.id}
                                    to={`/providers/${provider.id}/services/${otherService.id}`}
                                    className="service-other-link"
                                >
                                    <span>
                                        {otherService.service_name}
                                    </span>
                                    <span aria-hidden="true">→</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </aside>
            </div>

            {/* Booking popup */}
            {bookingOpen && (
                <div className="booking-modal-overlay">
                    <div
                        className="booking-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-modal-title"
                    >
                        <h2 id="booking-modal-title">
                            Send Booking Request
                        </h2>

                        <p>
                            Send a request to this service provider.
                            You can include a message or leave it empty.
                        </p>

                        <form onSubmit={handleBookingSubmit}>
                            <label htmlFor="booking-message">
                                Message (Optional)
                            </label>

                            <textarea
                                id="booking-message"
                                value={bookingMessage}
                                onChange={(event) =>
                                    setBookingMessage(event.target.value)
                                }
                                placeholder="Tell the provider what you need..."
                                rows={4}
                            />

                            {bookingError && (
                                <p className="booking-error" role="alert">
                                    {bookingError}
                                </p>
                            )}

                            <div className="booking-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setBookingOpen(false)}
                                    disabled={bookingSubmitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={bookingSubmitting}
                                >
                                    {bookingSubmitting
                                        ? "Sending..."
                                        : "Send Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ServiceDetails;
