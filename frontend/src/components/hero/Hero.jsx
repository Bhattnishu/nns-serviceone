import { Link } from "react-router-dom";
import "./Hero.css";


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">

        <p className="hero-label">LOCAL SERVICES</p>

        <h1>
          Find trusted services
          <span> near you.</span>
        </h1>

        <p className="hero-description">
          Connect with skilled local professionals for the services
          you need, right where you need them.
        </p>

        <div className="hero-actions">
          <Link to= "/services" className="primary-btn">
            Find a Service
          </Link>

          <Link to="/offer-service" className="secondary-btn">
            Offer Your Service
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Hero;