import { api } from "../lib/api";
import {
    AuthUser,
    GoogleAuthUrlResponse,
    GetMeResponse,
    OAuthCallbackResponse,
    UpdateProfilePayload,
    UpdateProfileResponse,
    LogoutResponse,
    DeleteAccountResponse,
} from "../types/auth";
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
     * I-exchange ang temporary Google OAuth code sa Supabase session
     * GET /v1/api/auth/callback?code=:code
     */
    async handleOAuthCallback(code: string): Promise<ApiResponse<OAuthCallbackResponse["data"] | null>> {
        try {
            const response = await api.get<OAuthCallbackResponse>(
                `/auth/callback?code=${encodeURIComponent(code)}`
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to exchange OAuth code",
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

    /**
     * I-update ang profile details (name, avatar_url, phone)
     * PATCH /v1/api/auth/profile
     */
    async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<AuthUser | null>> {
        try {
            const response = await api.patch<UpdateProfileResponse>("/auth/profile", payload);
            return {
                success: true,
                data: response.data.user,
                message: response.data.message || "Profile updated successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to update profile",
            };
        }
    }

    /**
     * I-terminate ang session token sa Supabase Auth
     * POST /v1/api/auth/logout
     */
    async logoutServer(): Promise<ApiResponse<null>> {
        try {
            const response = await api.post<LogoutResponse>("/auth/logout");
            return {
                success: true,
                data: null,
                message: response.data.message || "Logged out successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to logout from server",
            };
        }
    }

    /**
     * Permanenteng i-delete ang user account at cascade delete owned businesses & reviews
     * DELETE /v1/api/auth/account
     */
    async deleteAccount(): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete<DeleteAccountResponse>("/auth/account");
            return {
                success: true,
                data: null,
                message: response.data.message || "Account and associated data deleted successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to delete account",
            };
        }
    }
}

export const authService = new AuthService();
export default authService;