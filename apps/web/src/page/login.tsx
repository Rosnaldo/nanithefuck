import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            login(); // 🔁 redirects to Keycloak
        }
    }, [isAuthenticated, login]);

    return null; // nothing to render
}
