
import "./MyServicesList.css";
import MyServiceCard from "./MyServiceCard";

const MyServicesList = ({
  services,
  loading,
  error,
  onEdit,
  onDelete,
  deletingServiceId,
}) => {
  return (
    <section className="my-services-list">
      <div className="my-services-list-header">
        <h2>My services</h2>
        <span>{services.length} services</span>
      </div>

      {error && (
        <p className="offer-service-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="offer-service-loading">Loading your services...</p>
      ) : services.length === 0 ? (
        <p className="my-services-empty">
          You haven't added any services yet.
        </p>
      ) : (
        <div className="my-services-list-items">
          {services.map((service) => (
            <MyServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingServiceId === service.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyServicesList;
