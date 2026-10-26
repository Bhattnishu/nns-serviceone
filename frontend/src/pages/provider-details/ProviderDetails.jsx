
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProviderProfileHeader from "../../components/provider-profile-header/ProviderProfileHeader";
import ProviderServicesSection from "../../components/provider-services-section/ProviderServicesSection";
import ServiceLocation from "../../components/service-location/ServiceLocation";

import api from "../../api/axios";
import "./ProviderDetails.css";

const ProviderDetails = () => {
    const { id } = useParams();
    const routeLocation = useLocation();

    const returnTo = routeLocation.state?.returnTo || "/services";

    const searchResultsUrl =
        routeLocation.state?.searchResultsUrl || "/services";

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProvider = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `/discovery/providers/${id}/`
                );

                setProvider(response.data);
            } catch (error) {
                console.error("Failed to load provider:", error);
                setProvider(null);
                setError("Unable to load this provider. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [id]);

    if (loading) {
        return (
            <main className="provider-details-page">
                <p className="provider-details-message" role="status">
                    Loading provider profile...
                </p>
            </main>
        );
    }

    if (error || !provider) {
        return (
            <main className="provider-details-page">
                <p className="provider-details-error" role="alert">
                    {error || "Provider not found."}
                </p>

                <Link
                    to={returnTo}
                    state={{
                        returnTo: searchResultsUrl,
                        searchResultsUrl,
                    }}
                    className="provider-details-back"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to previous page
                </Link>
            </main>
        );
    }

    return (
        <main className="provider-details-page">
            <Link
                to={returnTo}
                state={{
                    returnTo: searchResultsUrl,
                    searchResultsUrl,
                }}
                className="provider-details-back"
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to previous page
            </Link>

            <ProviderProfileHeader provider={provider} />

            <section className="provider-profile-location">
                <ServiceLocation provider={provider} />
            </section>

            <ProviderServicesSection provider={provider} />
        </main>
    );
};

export default ProviderDetails;
