
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem("accessToken"))
    );

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
