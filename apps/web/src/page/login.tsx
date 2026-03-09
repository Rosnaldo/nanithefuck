import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            login(); // 🔁 redirects to Keycloak
        } else {
            navigate("/meeting/chacara-meets");
        }
    }, [isAuthenticated, login]);

    return null; // nothing to render
}
