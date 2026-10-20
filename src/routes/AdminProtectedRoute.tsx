import React, { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useUserAuth } from "../hooks/useUserAuth";

interface AdminProtectedRouteProps {
    children?: ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useUserAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">Verifying admin credentials...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Role Guard: founder o admin lang ang pwedeng pumasok
    const isPlatformAdmin =
        user?.is_admin === true ||
        user?.role === "founder" ||
        user?.role === "admin" ||
        user?.email?.toLowerCase() === "faboradanathaniel@gmail.com";

    if (!isPlatformAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
