import { SlidersHorizontal } from "lucide-react";
import "./ServiceFilters.css";

const ServiceFilters = ({
    categories = [],
    filters = {},
    onFilterChange,
    onApply,
    onClear,
}) => {
    const handleChange = (event) => {
        onFilterChange(event.target.name, event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onApply();
    };

    return (
        <section className="service-filters">
            <div className="service-filters-heading">
                <SlidersHorizontal size={20} aria-hidden="true" />

                <div>
                    <h2>Filter services</h2>
                    <p>Narrow down the available services.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="service-filters-fields">
                    <div className="service-filter-field">
                        <label htmlFor="filter-category">
                            Service category
                        </label>

                        <select
                            id="filter-category"
                            name="category"
                            value={filters.category || ""}
                            onChange={handleChange}
                        >
                            <option value="">All categories</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="service-filter-field">
                        <label htmlFor="filter-state">State</label>

                        <input
                            id="filter-state"
                            name="state"
                            type="text"
                            value={filters.state || ""}
                            onChange={handleChange}
                            placeholder="e.g. Rajasthan"
                        />
                    </div>

                    <div className="service-filter-field">
                        <label htmlFor="filter-district">District</label>

                        <input
                            id="filter-district"
                            name="district"
                            type="text"
                            value={filters.district || ""}
                            onChange={handleChange}
                            placeholder="e.g. Jaipur"
                        />
                    </div>
                </div>

                <div className="service-filters-actions">
                    <button type="button" onClick={onClear}>
                        Clear filters
                    </button>

                    <button type="submit">
                        Apply filters
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ServiceFilters;
