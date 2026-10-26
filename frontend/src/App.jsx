import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
import OfferService from "./pages/offer-service/OfferService";
import ServiceDetails from "./pages/service-details/ServiceDetails";
import ProviderDetails from "./pages/provider-details/ProviderDetails";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";

const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route
                    path="/providers/:providerId/services/:serviceId"
                    element={<ServiceDetails />}
                />
                <Route
                    path="/providers/:id"
                    element={<ProviderDetails />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/offer-service"
                    element={<OfferService />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
