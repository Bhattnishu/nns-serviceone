import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ServiceOverview from "../../components/service-overview/ServiceOverview";
import ServiceLocation from "../../components/service-location/ServiceLocation";
import ProviderSummary from "../../components/provider-summary/ProviderSummary";
import api from "../../api/axios";

import "./ServiceDetails.css";

const ServiceDetails = () => {
    const { providerId, serviceId } = useParams();
    const routeLocation = useLocation();

    const searchResultsUrl =
        routeLocation.state?.searchResultsUrl ||
        routeLocation.state?.returnTo ||
        "/services";
        
    const serviceDetailsUrl =
        `${routeLocation.pathname}${routeLocation.search}${routeLocation.hash}`;

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                                    <span>{otherService.service_name}</span>
                                    <span aria-hidden="true">→</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
};

export default ServiceDetails;