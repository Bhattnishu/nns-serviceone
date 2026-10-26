import {Link} from "react-router-dom"
import "./ServicesHeader.css"

const ServicesHeader = () => {
  return (
    <header className="services-header">
        <div className="services-header-topline">
            <p className="services-eyebrow">
                SEARCH RESULTS
            </p>
            <Link to="/" className="services-home-link">
                ← Back to Home
            </Link>
        </div>
        <h1>Explore available services</h1>
        <p className="services-header-description">
            Compare local professionals, services, and prices to find the right match for your needs. 
        </p>
    </header>
  )
}

export default ServicesHeader
