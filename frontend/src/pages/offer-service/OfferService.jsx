import "./OfferService.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProviderApplication from "../../components/offer-service-components/ProviderApplication";
import ServiceForm from "../../components/offer-service-components/ServiceForm";
import MyServicesList from "../../components/offer-service-components/MyServicesList";

const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    return Object.values(data)
      .flat()
      .map((message) =>
        typeof message === "string" ? message : JSON.stringify(message)
      )
      .join(" ");
  }

  return fallback;
};

const emptyServiceForm = {
  category: "",
  service_name: "",
  description: "",
  price: "",
};

const initialApplicationForm = {
  description: "",
  experience_years: "0",
  service_area: "",
  service_district: "",
  service_state: "",
  service_pincode: "",
};

const OfferService = () => {
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [formData, setFormData] = useState(initialApplicationForm);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesLoadError, setServicesLoadError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [submittingService, setSubmittingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  const loadServices = async () => {
    setLoadingServices(true);
    setServicesLoadError("");

    try {
      const response = await api.get(
        "/providers/services/my/",
        authConfig()
      );
      setServices(response.data);
    } catch (err) {
      setServicesLoadError(
        getErrorMessage(err, "Could not load your services.")
      );
    } finally {
      setLoadingServices(false);
    }
  };

  const loadCategories = async () => {
    setCategoryError("");

    try {
      const response = await api.get("/discovery/categories/");
      setCategories(response.data);
    } catch (err) {
      setCategoryError(
        getErrorMessage(err, "Could not load service categories.")
      );
    }
  };

  useEffect(() => {
    const checkProviderProfile = async () => {
      if (!localStorage.getItem("accessToken")) {
        setProfileError("Please log in to offer your services.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          "/providers/profile/me/",
          authConfig()
        );
        setProviderProfile(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProviderProfile(null);
        } else if (err.response?.status === 401) {
          setProfileError("Your session has expired. Please log in again.");
        } else {
          setProfileError("Could not load your provider profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkProviderProfile();
  }, []);

  useEffect(() => {
    if (providerProfile?.status === "APPROVED") {
      loadCategories();
      loadServices();
    }
  }, [providerProfile]);

  const handleApplicationChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleApplicationSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setApplicationError("Please log in to apply.");
      return;
    }

    setSubmittingApplication(true);
    setApplicationError("");

    try {
      const response = await api.post(
        "/providers/profile/",
        {
          ...formData,
          experience_years: Number(formData.experience_years),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProviderProfile(response.data);
    } catch (err) {
      setApplicationError(
        getErrorMessage(
          err,
          "Could not submit your application. Please try again."
        )
      );
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleServiceChange = (event) => {
    const { name, value } = event.target;
    setServiceForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      category: String(
        typeof service.category === "object"
          ? service.category.id
          : service.category
      ),
      service_name: service.service_name,
      description: service.description || "",
      price: String(service.price),
    });
    setServiceError("");

    document
      .querySelector(".offer-service-page")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setServiceError("");
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();

    if (!localStorage.getItem("accessToken")) {
      setServiceError("Please log in again to submit a service.");
      return;
    }

    setSubmittingService(true);
    setServiceError("");

    const payload = {
      ...serviceForm,
      category: Number(serviceForm.category),
      price: serviceForm.price,
    };

    try {
      if (editingServiceId !== null) {
        await api.patch(
          `/providers/services/${editingServiceId}/`,
          payload,
          authConfig()
        );
      } else {
        await api.post("/providers/services/", payload, authConfig());
      }

      setEditingServiceId(null);
      setServiceForm(emptyServiceForm);
      await loadServices();
    } catch (err) {
      setServiceError(
        getErrorMessage(
          err,
          editingServiceId !== null
            ? "Could not update your service. Please try again."
            : "Could not submit your service. Please try again."
        )
      );
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${service.service_name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingServiceId(service.id);
    setServiceError("");

    try {
      await api.delete(
        `/providers/services/${service.id}/`,
        authConfig()
      );

      if (editingServiceId === service.id) {
        setEditingServiceId(null);
        setServiceForm(emptyServiceForm);
      }

      await loadServices();
    } catch (err) {
      setServiceError(
        getErrorMessage(err, "Could not delete your service. Please try again.")
      );
    } finally {
      setDeletingServiceId(null);
    }
  };

  if (loading) {
    return (
      <main className="offer-service-page">
        <div className="offer-service-container">
          <p className="offer-service-loading">
            Checking your provider profile...
          </p>
        </div>
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="offer-service-page">
        <div className="offer-service-container">
          <section className="offer-service-card">
            <p
              className="offer-service-message offer-service-error"
              role="alert"
            >
              {profileError}
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!providerProfile) {
    return (
      <ProviderApplication
        formData={formData}
        onChange={handleApplicationChange}
        onSubmit={handleApplicationSubmit}
        error={applicationError}
        submitting={submittingApplication}
      />
    );
  }

  const statusMessages = {
    PENDING: "Your application is waiting for admin review.",
    APPROVED: "Your profile is approved. You can now create service listings.",
    REJECTED:
      "Your application was rejected. Please contact support for more information.",
  };

  if (providerProfile.status !== "APPROVED") {
    return (
      <main className="offer-service-page">
        <div className="offer-service-container">
          <header className="offer-service-header">
            <h1>Your Provider Application</h1>
            <p>Check the review status of your provider profile.</p>
          </header>

          <section className="offer-service-card">
            <h2>Application status</h2>
            <span className="offer-service-status">
              {providerProfile.status}
            </span>
            <p className="offer-service-message">
              {statusMessages[providerProfile.status] ||
                "Your application status is currently unavailable."}
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="offer-service-page">
      <div className="offer-service-container">
        <header className="offer-service-header">
          <h1>Offer Your Service</h1>
          <p>
            Add the services you provide. Each service will be reviewed by the
            ServiceOne admin before appearing to customers.
          </p>
        </header>

        <section className="offer-service-card">
          <p className="offer-service-message">
            {editingServiceId !== null
              ? "Update the service details. After saving, the service will return to pending review."
              : "Your provider profile is approved. Submit your service details below for review."}
          </p>

          <ServiceForm
            serviceForm={serviceForm}
            categories={categories}
            onChange={handleServiceChange}
            onSubmit={handleServiceSubmit}
            onCancel={handleCancelEdit}
            editingServiceId={editingServiceId}
            submitting={submittingService}
            error={serviceError}
            categoryError={categoryError}
          />
        </section>

        <section className="offer-service-card offer-service-list">
          <MyServicesList
            services={services.map((service) => ({
              ...service,
              category_name:
                categories.find(
                  (category) =>
                    Number(category.id) ===
                    Number(
                      typeof service.category === "object"
                        ? service.category.id
                        : service.category
                    )
                )?.name || service.category_name,
            }))}
            loading={loadingServices}
            error={servicesLoadError}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            deletingServiceId={deletingServiceId}
          />
        </section>
      </div>
    </main>
  );
};

export default OfferService;
