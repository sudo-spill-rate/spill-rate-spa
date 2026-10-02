import { api } from "../lib/api";
import { AuthUser, GoogleAuthUrlResponse, GetMeResponse } from "../types/auth";
import { ApiResponse } from "../types/api";

class AuthService {
    /**
     * Kumuha ng Google OAuth consent URL
     * GET /v1/api/auth/google
     */
    async getGoogleAuthUrl(redirectTo?: string): Promise<ApiResponse<{ url: string }>> {
        try {
            const callbackUrl = redirectTo || `${window.location.origin}/oauth/callback`;
            const response = await api.get<GoogleAuthUrlResponse>(
                `/auth/google?redirect_to=${encodeURIComponent(callbackUrl)}`
            );

            return {
                success: true,
                data: { url: response.data.url },
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: { url: "" },
                message: error.response?.data?.message || "Failed to get Google Auth URL",
            };
        }
    }

    /**
     * Kumuha ng profile ng kasalukuyang naka-login na user
     * GET /v1/api/auth/me
     */
    async getMe(token?: string): Promise<ApiResponse<AuthUser | null>> {
        try {
            const requestConfig = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined;
            const response = await api.get<GetMeResponse>("/auth/me", requestConfig);
            return {
                success: true,
                data: response.data.user,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to fetch user profile",
            };
        }
    }
}

export const authService = new AuthService();
export default authService;