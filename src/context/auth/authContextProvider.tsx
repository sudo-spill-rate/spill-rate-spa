import React, {
    useState,
    useEffect,
    ReactNode,
    useRef,
    useCallback,
} from "react";
import { AuthContext } from "./authContext";
import { AuthUser, UpdateProfilePayload } from "../../types/auth";
import { authService } from "../../services/authService";
import { api } from "../../lib/api";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const isCheckingRef = useRef<boolean>(false);

    const updateAuthState = useCallback(
        (authenticated: boolean, userData: AuthUser | null, authToken: string | null) => {
            setIsAuthenticated(authenticated);
            setUser(userData);
            setTokenState(authToken);
            setIsLoading(false);
        },
        []
    );

    // Kumuha ng user profile gamit ang authService (GET /v1/api/auth/me)
    const checkAuth = async (explicitToken?: string): Promise<boolean> => {
        if (isCheckingRef.current) return isAuthenticated;
        isCheckingRef.current = true;
        setIsLoading(true);

        try {
            const currentToken =
                explicitToken ||
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken");

            if (!currentToken) {
                delete api.defaults.headers.common["Authorization"];
                updateAuthState(false, null, null);
                return false;
            }

            // Siguraduhing naka-bind ang Bearer token sa axios bago tumawag
            localStorage.setItem("accessToken", currentToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;

            const response = await authService.getMe(currentToken);

            if (response.success && response.data) {
                updateAuthState(true, response.data, currentToken);
                return true;
            }

            throw new Error(response.message || "Failed to authenticate");
        } catch {
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
            delete api.defaults.headers.common["Authorization"];
            updateAuthState(false, null, null);
            return false;
        } finally {
            setIsLoading(false);
            isCheckingRef.current = false;
        }
    };

    // Google OAuth redirection gamit ang authService (GET /v1/api/auth/google)
    const loginWithGoogle = async (targetRedirectPath?: string): Promise<void> => {
        try {
            setIsLoading(true);
            const targetPath = targetRedirectPath || "/dashboard";
            if (typeof window !== "undefined") {
                sessionStorage.setItem("auth_redirect_target", targetPath);
            }

            const callbackUrl = `${window.location.origin}/oauth/callback`;
            const response = await authService.getGoogleAuthUrl(callbackUrl);

            if (response.success && response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error(response.message || "Failed to retrieve Google OAuth URL");
            }
        } catch (error: any) {
            console.error("Google login error:", error?.message);
            setIsLoading(false);
            throw error;
        }
    };

    // Exchange Google OAuth code para sa session (GET /v1/api/auth/callback?code=...)
    const handleOAuthCode = async (code: string): Promise<{ success: boolean; message?: string }> => {
        try {
            setIsLoading(true);
            const res = await authService.handleOAuthCallback(code);

            if (res.success && res.data?.session?.access_token) {
                const accessToken = res.data.session.access_token;
                await setToken(accessToken);
                return { success: true };
            }

            return {
                success: false,
                message: res.message || "Failed to exchange OAuth code",
            };
        } catch (err: any) {
            return {
                success: false,
                message: err?.message || "Failed to exchange OAuth code",
            };
        } finally {
            setIsLoading(false);
        }
    };

    const setToken = async (newToken: string): Promise<void> => {
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        await checkAuth(newToken);
    };

    // Update Profile details (PATCH /v1/api/auth/profile)
    const updateProfile = async (
        payload: UpdateProfilePayload
    ): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
        try {
            setIsLoading(true);
            const res = await authService.updateProfile(payload);
            if (res.success && res.data) {
                setUser(res.data);
                return { success: true, user: res.data, message: res.message };
            }
            return { success: false, message: res.message || "Failed to update profile" };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to update profile" };
        } finally {
            setIsLoading(false);
        }
    };

    // Revoke session server-side at linisin ang client-side tokens (POST /v1/api/auth/logout)
    const logout = async (): Promise<void> => {
        try {
            await authService.logoutServer();
        } catch (err) {
            console.error("Server logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
            delete api.defaults.headers.common["Authorization"];
            updateAuthState(false, null, null);
        }
    };

    // Delete user account permanently (DELETE /v1/api/auth/account)
    const deleteAccount = async (): Promise<{ success: boolean; message?: string }> => {
        try {
            setIsLoading(true);
            const res = await authService.deleteAccount();
            if (res.success) {
                localStorage.removeItem("accessToken");
                sessionStorage.removeItem("accessToken");
                delete api.defaults.headers.common["Authorization"];
                updateAuthState(false, null, null);
                return { success: true, message: res.message };
            }
            return { success: false, message: res.message || "Failed to delete account" };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to delete account" };
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        await checkAuth();
    };

    useEffect(() => {
        const handleInitialAuth = async () => {
            // Huwag kainin ang hash/query kung nasa /oauth/callback upang mabasa ito ng OAuthCallbackPage
            if (window.location.pathname === "/oauth/callback") {
                setIsLoading(false);
                return;
            }

            // Fallback para sa external redirects na may access_token sa hash
            const hash = window.location.hash;
            if (hash && hash.includes("access_token=")) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get("access_token");

                if (accessToken) {
                    window.history.replaceState(null, "", window.location.pathname);
                    await setToken(accessToken);
                    return;
                }
            }

            await checkAuth();
        };

        handleInitialAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated,
                loginWithGoogle,
                handleOAuthCode,
                updateProfile,
                deleteAccount,
                logout,
                checkAuth,
                refreshUser,
                setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;