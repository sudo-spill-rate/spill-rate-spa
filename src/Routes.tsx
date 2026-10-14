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
import { AuthProvider } from "./context/auth/authContextProvider";
import { BusinessProvider } from "./context/business/businessContextProvider";

// 3. Pages & Guards
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminProtectedRoute } from "./routes/AdminProtectedRoute";
import PageNotFound from "./pages/PageNotFound/PageNotFoundPage";
import PublicLayout from "./pages/PublicPages/components/layout/PublicLayout";

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
            {/* 🔐 Global AuthProvider: Para sa user session at navbar sa buong app */}
            <AuthProvider>
                <ReactRoutes>
                    {/* 1. Public Pages (Landing, About, Contact, FAQ, Terms, Privacy) */}
                    <Route element={<PublicLayout />}>
                        {PublicRoutes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>

                    {/* 2. Authentication Routes (/login, /oauth/callback) */}
                    {AuthRoutes.map((route) => (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* 3. Customer Review Routes (/business/:slug, /business/:businessId/write-review) */}
                    {ReviewRoutes.map((route) => (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={
                                <BusinessProvider>
                                    {route.element}
                                </BusinessProvider>
                            }
                        />
                    ))}

                    {/* 4. 🔐 Protected Business Owner Portal (/dashboard, /dashboard/business/:id) */}
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

                    {/* 5. 🛡️ Protected Platform Admin Portal (/admin) */}
                    <Route
                        element={
                            <AdminProtectedRoute>
                                <BusinessProvider>
                                    <Outlet />
                                </BusinessProvider>
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

                    {/* 6. 404 Fallback */}
                    <Route path="*" element={<PageNotFound />} />
                </ReactRoutes>
            </AuthProvider>
        </QueryClientProvider>
    );
}