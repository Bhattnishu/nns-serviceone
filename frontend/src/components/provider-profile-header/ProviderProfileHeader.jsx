
import { BriefcaseBusiness } from "lucide-react";

import "./ProviderProfileHeader.css";

const ProviderProfileHeader = ({ provider }) => {
    const providerName = provider.user_name || "Service provider";
    const experienceYears = Number(provider.experience_years);

    const hasExperience =
        Number.isFinite(experienceYears) && experienceYears > 0;

    return (
        <section className="provider-profile-card">
            <div className="provider-profile-header">
                <div className="provider-profile-photo-wrapper">
                    {provider.profile_photo ? (
                        <img
                            className="provider-profile-photo"
                            src={provider.profile_photo}
                            alt={`${providerName}'s profile`}
                        />
                    ) : (
                        <div
                            className="provider-profile-placeholder"
                            aria-hidden="true"
                        >
                            {providerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="provider-profile-info">
                    <p className="provider-profile-eyebrow">
                        SERVICE PROVIDER
                    </p>

                    <h1>{providerName}</h1>

                    <p className="provider-profile-description">
                        {provider.description ||
                            "This provider has not added a description yet."}
                    </p>

                    {hasExperience && (
                        <p className="provider-profile-experience">
                            <BriefcaseBusiness
                                size={17}
                                aria-hidden="true"
                            />

                            {experienceYears}{" "}
                            {experienceYears === 1 ? "year" : "years"}{" "}
                            of experience
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProviderProfileHeader;
