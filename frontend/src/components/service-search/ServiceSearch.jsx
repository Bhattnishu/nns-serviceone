
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceSearch.css";

const ServiceSearch = () => {
    const navigate = useNavigate();

    const [service, setService] = useState("");
    const [area, setArea] = useState("");
    const [pincode, setPincode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (service.trim()) {
            params.append("search", service.trim());
        }

        if (area.trim()) {
            params.append("area", area.trim());
        }

        if (pincode.trim()) {
            params.append("pincode", pincode.trim());
        }

        const queryString = params.toString();

        navigate(queryString ? `/services?${queryString}` : "/services");
    };

    return (
        <form className="service-search" onSubmit={handleSubmit}>
            <h2>Find a service</h2>

            <div className="search-field">
                <label htmlFor="service">
                    What service do you need?
                </label>

                <input
                    type="text"
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. Math tutor, laptop repair"
                />
            </div>

            <div className="search-location-fields">
                <div className="search-field">
                    <label htmlFor="area">
                        Local area *
                    </label>

                    <input
                        type="text"
                        id="area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Road, Area, City, State"
                    />
                </div>

                <div className="search-field">
                    <label htmlFor="pincode">
                        PIN code *
                    </label>

                    <input
                        type="text"
                        id="pincode"
                        inputMode="numeric"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="2625.."
                    />
                </div>
            </div>

            <button type="submit">
                Find Services
            </button>
        </form>
    );
};

export default ServiceSearch;