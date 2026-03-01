import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner"

import UsersPage from "./page/users";
import MeetingsPage from "./page/meetings";
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
                <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/meetings" element={<MeetingsPage />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}
