import "./ServicesResultsHeading.css";

const ServicesResultsHeading = ({ totalServices, totalProviders }) => {
    return (
        <div className="services-results-heading">
            <h2>Matching Services</h2>

            <p>
                {totalServices}{" "}
                {totalServices === 1 ? "service" : "services"}
                {" "}from{" "}
                {totalProviders}{" "}
                {totalProviders === 1 ? "provider" : "providers"}
            </p>
        </div>
    );
};

export default ServicesResultsHeading;