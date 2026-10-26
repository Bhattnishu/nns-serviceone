import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const message = location.state?.message;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login/", formData);

            login(response.data.access, response.data.refresh);

            navigate("/", { replace: true });
        } catch (err) {
            const data = err.response?.data;

            if (data?.detail) {
                setError(data.detail);
            } else if (data && typeof data === "object") {
                setError(
                    Object.values(data).flat().join(" ")
                    || "Login failed. Please try again."
                );
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            pageClass="login-page"
            cardClass="login-card"
            title="Welcome back"
            subtitle="Log in to continue to ServiceOne."
            subtitleClass="login-subtitle"
            footer={
                <p className="login-register">
                    Don't have an account?{" "}
                    <Link to="/register">Create one</Link>
                </p>
            }
        >
            {message && (
                <p className="login-success" role="status">
                    {message}
                </p>
            )}

            {error && (
                <p className="login-error" role="alert">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <AuthField
                    id="identifier"
                    label="Email or phone number"
                    placeholder="Enter your email or phone"
                    value={formData.identifier}
                    onChange={handleChange}
                    autoComplete="username"
                    className="login-field"
                />

                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="login-field"
                />

                <AuthSubmitButton
                    loading={loading}
                    loadingText="Logging in..."
                >
                    Log in
                </AuthSubmitButton>
            </form>
        </AuthLayout>
    );
};

export default Login;
