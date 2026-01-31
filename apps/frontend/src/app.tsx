import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner"

import HomePage from "./page/home";
import NotFound from "./page/not-found";
import { ProtectedRoute } from "./protected-route";
import LoginPage from "./page/login";
import { AuthProvider } from "./providers/auth-provider";

export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Toaster />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/main" element={<HomePage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </QueryClientProvider>
    )
}
