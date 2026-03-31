import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner"

import HomePage from "./page/home";
import MeetingPage from "./page/meeting_2";
import NotFound from "./page/not-found";
import { ProtectedRoute } from "./protected-route";
import LoginPage from "./page/login";
import { AuthProvider } from "./providers/auth-provider";
import ProfilePage from "./page/profile";

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
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/meeting/:slug" element={<MeetingPage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </QueryClientProvider>
    )
}
