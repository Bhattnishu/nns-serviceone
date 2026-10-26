
import { Link } from "react-router-dom";
import { BriefcaseBusiness, UserRound } from "lucide-react";

import "./ProviderSummary.css";

const ProviderSummary = ({ provider, returnTo, searchResultsUrl }) => {
    const providerName = provider.user_name || "Service provider";
    const experienceYears = Number(provider.experience_years);

    const hasExperience =
        Number.isFinite(experienceYears) && experienceYears > 0;

    return (
        <section className="provider-summary">
            <div className="provider-summary-header">
                <div className="provider-summary-intro">
                    <p className="provider-summary-eyebrow">
                        YOUR SERVICE PROVIDER
                    </p>

                    <h2 className="provider-summary-name">
                        <UserRound size={18} aria-hidden="true" />
                        {providerName}
                    </h2>

                    <p className="provider-summary-description">
                        {provider.description ||
                            "No provider description is available yet."}
                    </p>
                </div>

                <div className="provider-summary-image-wrapper">
                    {provider.profile_photo ? (
                        <img
                            className="provider-summary-photo"
                            src={provider.profile_photo}
                            alt={`${providerName}'s profile photo`}
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="provider-summary-placeholder"
                            aria-hidden="true"
                        >
                            {providerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {hasExperience && (
                <p className="provider-summary-experience">
                    <BriefcaseBusiness size={17} aria-hidden="true" />
                    {experienceYears}{" "}
                    {experienceYears === 1 ? "year" : "years"} of experience
                </p>
            )}

            <Link
                to={`/providers/${provider.id}`}
                state={{ returnTo, searchResultsUrl }}
                className="provider-summary-profile-button"
            >
                View Full Profile
                <span aria-hidden="true">→</span>
            </Link>
        </section>
    );
};

export default ProviderSummary;
