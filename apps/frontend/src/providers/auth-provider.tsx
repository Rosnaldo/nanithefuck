import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { keycloak } from '../api/keycloak';

type User = { email: string; fullname: string };

type AuthContextType = {
    loggedUser: User;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false); // 🔐 proteção
    const [ready, setReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedUser, setLoggedUser] = useState<User>({ email: '', fullname: '' });

    useEffect(() => {
        if (initialized.current) return; // ⛔ evita múltiplos init
        initialized.current = true;

        keycloak
        .init({
            redirectUri: window.location.origin + '/main',
            onLoad: "check-sso",   // ⬅ no forced redirect
            pkceMethod: "S256",
            silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        })
        .then((auth) => {
            const parsed = keycloak.tokenParsed;
            const email = parsed?.email;
            const fullname = parsed?.name;

            setIsAuthenticated(auth);
            setReady(true);
            setLoggedUser({ email, fullname });
        })
        .catch(console.error);

        keycloak.onAuthSuccess = () => setIsAuthenticated(true);
        keycloak.onAuthLogout = () => setIsAuthenticated(false);

        keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).catch(() => {
                setIsAuthenticated(false);
                keycloak.logout({
                redirectUri: window.location.origin,
                });
            });
        };
    }, []);

    if (!ready) return <div>Loading session…</div>;

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loggedUser,
                login: () =>
                    keycloak.login({
                        redirectUri: window.location.origin + "/main",
                    }),
                logout: () =>
                    keycloak.logout({
                        redirectUri: window.location.origin,
                    }),
            }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
