import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import config from "../config";

const baseUrl = config?.API_URL || "http://localhost:3000/v1/api";

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// 🔐 1. Request Interceptor na may explicit InternalAxiosRequestConfig type
api.interceptors.request.use((reqConfig: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        // Alisin ang persistent localStorage access; gamitin ang sessionStorage bilang temporary tab fallback
        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken");

        if (token && reqConfig.headers) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
    }
    return reqConfig;
});

// Navigation callback para sa auth redirects
let navigateFunction: ((to: string) => void) | null = null;
let authRefreshCallback: (() => void) | null = null;

export const setAuthNavigate = (navigate: (to: string) => void) => {
    navigateFunction = navigate;
};

export const setAuthRefreshCallback = (callback: () => void) => {
    authRefreshCallback = callback;
};

// 🔐 2. Response Interceptor na may explicit AxiosResponse at AxiosError types
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        // 🛑 Network error o patay ang backend server
        if (!error.response) {
            console.error("Network error: Server is unreachable.");
            return Promise.reject(error);
        }

        const status = error.response.status;
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 🛑 Huwag i-redirect kung nag-401 mula sa auth checks o public browsing
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        const isPublicRoute =
            currentPath === "/" ||
            currentPath.startsWith("/explore") ||
            currentPath.startsWith("/business/");

        if (
            originalRequest?.url?.includes("/auth/me") ||
            originalRequest?.url?.includes("/business/owner") ||
            isPublicRoute
        ) {
            return Promise.reject(error);
        }

        // 🔁 Handle 401 Unauthorized sa mga protected actions (hal. dashboard mutations)
        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Linisin ang expired o invalid token sa storage
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                sessionStorage.removeItem("accessToken");
            }

            // Tawagin ang refresh callback kung mayroon
            if (authRefreshCallback) {
                authRefreshCallback();
            }

            // I-redirect ang user sa root page
            if (navigateFunction) {
                navigateFunction("/");
            } else if (typeof window !== "undefined") {
                window.location.href = "/";
            }

            return Promise.reject(error);
        }

        // 🛑 429 Too Many Requests (Anti-Spam Cooldown sa Reviews)
        if (status === 429) {
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;