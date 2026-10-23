import React from "react";
import { Routes as ReactRoutes, Route, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Route Arrays
import { PublicRoutes } from "./routes/Routes.public";
import { AuthRoutes } from "./routes/Routes.auth";
import { ReviewRoutes } from "./routes/Routes.review";
import { BusinessRoutes } from "./routes/Routes.business";
import { AdminRoutes } from "./routes/Routes.admin";

// 2. Providers
import { AppProviders } from "./context/AppProviders";

// 3. Pages & Guards
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminProtectedRoute } from "./routes/AdminProtectedRoute";
import PageNotFound from "./pages/PageNotFound/PageNotFoundPage";
import PublicLayout from "./pages/PublicPages/components/layout/PublicLayout";
import ScrollToTop from "./components/common/ScrollToTop";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function Routes() {
    return (
        <QueryClientProvider client={queryClient}>
            {/* Global AppProviders: Auth, Business, Review, at ManageReview */}
            <AppProviders>
                <ScrollToTop />
                <ReactRoutes>
                    {/* 1. Public Pages (Landing, About, Contact, FAQ, Terms, Privacy) & 404 Fallback */}
                    <Route element={<PublicLayout />}>
                        {PublicRoutes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                        <Route path="*" element={<PageNotFound />} />
                    </Route>

                    {/* 2. Authentication Routes (/login, /oauth/callback) */}
                    {AuthRoutes.map((route) => (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* 3. Customer Review Routes */}
                    {ReviewRoutes.map((route) => (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* 4. Protected Business Owner Portal (/dashboard, /dashboard/business/:id) */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Outlet />
                            </ProtectedRoute>
                        }
                    >
                        {BusinessRoutes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>

                    {/* 5. Protected Platform Admin Portal (/admin) */}
                    <Route
                        element={
                            <AdminProtectedRoute>
                                <Outlet />
                            </AdminProtectedRoute>
                        }
                    >
                        {AdminRoutes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </ReactRoutes>
            </AppProviders>
        </QueryClientProvider>
    );
}