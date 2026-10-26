
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";

import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            await api.post("/auth/register/", formData);

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please log in.",
                },
            });
        } catch (err) {
            const responseData = err.response?.data;

            if (responseData) {
                const firstError = Object.values(responseData)
                    .flat()
                    .find((message) => typeof message === "string");

                setError(
                    firstError || "Registration failed. Please try again."
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
            pageClass="register-page"
            cardClass="register-card"
            title="Create your account"
            subtitle="Join ServiceOne to find or offer local services."
            subtitleClass="register-subtitle"
            footer={
                <p className="register-login-link">
                    Already have an account?{" "}
                    <Link to="/login">Log in</Link>
                </p>
            }
        >
            {error && (
                <p className="register-error" role="alert">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <AuthField
                    id="name"
                    label="Full name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="register-field"
                />

                <AuthField
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="register-field"
                />

                <AuthField
                    id="phone"
                    label="Phone number"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="register-field"
                />

                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="register-field"
                />

                <AuthSubmitButton
                    className="register-submit"
                    loading={loading}
                    loadingText="Creating account..."
                >
                    Create account
                </AuthSubmitButton>
            </form>
        </AuthLayout>
    );
};

export default Register;
