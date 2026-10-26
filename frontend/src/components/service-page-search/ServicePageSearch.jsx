
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import "./ServicePageSearch.css";

const ServicePageSearch = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [service, setService] = useState(
        searchParams.get("search") || ""
    );
    const [area, setArea] = useState(
        searchParams.get("area") || ""
    );
    const [pincode, setPincode] = useState(
        searchParams.get("pincode") || ""
    );


    useEffect(() => {
        setService(searchParams.get("search") || "");
        setArea(searchParams.get("area") || "");
        setPincode(searchParams.get("pincode") || "");
    }, [searchParams]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const params = new URLSearchParams();

        if (service.trim()) {
            params.set("search", service.trim());
        }

        if (area.trim()) {
            params.set("area", area.trim());
        }

        if (pincode.trim()) {
            params.set("pincode", pincode.trim());
        }

        const queryString = params.toString();

        navigate(queryString ? `/services?${queryString}` : "/services");
    };

    return (
        <section className="service-page-search">
            <form onSubmit={handleSubmit}>
                <div className="service-page-search-fields">
                    <div className="service-page-search-field">
                        <label
                            className="search-sr-only"
                            htmlFor="page-search-service"
                        >
                            Service
                        </label>
                        <input
                            id="page-search-service"
                            type="text"
                            value={service}
                            onChange={(event) => setService(event.target.value)}
                            placeholder="Service (e.g. tutor)"
                        />
                    </div>

                    <div className="service-page-search-field">
                        <label
                            className="search-sr-only"
                            htmlFor="page-search-area"
                        >
                            Local area
                        </label>
                        <input
                            id="page-search-area"
                            type="text"
                            value={area}
                            onChange={(event) => setArea(event.target.value)}
                            placeholder="Local area"
                        />
                    </div>

                    <div className="service-page-search-field">
                        <label
                            className="search-sr-only"
                            htmlFor="page-search-pincode"
                        >
                            PIN code
                        </label>
                        <input
                            id="page-search-pincode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={pincode}
                            onChange={(event) => setPincode(event.target.value)}
                            placeholder="PIN code"
                        />
                    </div>

                    <button
                        type="submit"
                        className="service-page-search-button"
                        aria-label="Search services"
                        title="Search services"
                    >
                        <Search size={20} aria-hidden="true" />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ServicePageSearch;
