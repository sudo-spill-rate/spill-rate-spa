// 1. Roles sa system batay sa platform_admins
export type UserRole = "founder" | "admin" | "user";

// 2. Authenticated User Profile (Ibinabalik ng GET /v1/api/auth/me at PATCH /v1/api/auth/profile)
export interface AuthUser {
    id: string; // Supabase Auth User UUID
    email: string;
    name: string; // Full name mula sa Google account o updated profile
    avatar_url: string | null; // Profile picture URL mula sa Google o Cloudinary
    phone?: string | null; // Contact telephone or mobile number
    provider: string; // e.g. 'google'
    role?: UserRole; // 'founder' | 'admin' | 'user'
    is_admin?: boolean; // True kung founder o admin
}

// 3. Response mula sa GET /v1/api/auth/me
export interface GetMeResponse {
    success: true;
    user: AuthUser;
}

// 4. Response mula sa GET /v1/api/auth/google
export interface GoogleAuthUrlResponse {
    success: true;
    url: string; // Google OAuth consent URL na pupuntahan ng user
    message: string;
}

// 5. Query parameters kapag humihingi ng Google Auth URL
export interface GoogleAuthUrlQuery {
    redirect_to?: string; // Callback URL sa frontend pagkatapos mag-sign in
    redirect?: boolean | 'true' | 'false'; // Kung gusto mong i-auto redirect ng server
}

// 6. OAuth Session & User returned from GET /v1/api/auth/callback?code=...
export interface OAuthSessionData {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
}

export interface OAuthCallbackData {
    session: OAuthSessionData;
    user: {
        id: string;
        email: string;
        user_metadata?: {
            full_name?: string;
            avatar_url?: string;
            [key: string]: any;
        };
    };
}

export interface OAuthCallbackResponse {
    success: true;
    message: string;
    data: OAuthCallbackData;
}

// 7. Payload para sa pag-update ng profile (PATCH /v1/api/auth/profile)
export interface UpdateProfilePayload {
    name?: string;
    avatar_url?: string;
    phone?: string;
}

export interface UpdateProfileResponse {
    success: true;
    message: string;
    user: AuthUser;
}

// 8. Response mula sa POST /v1/api/auth/logout
export interface LogoutResponse {
    success: true;
    message: string;
}

// 9. Response mula sa DELETE /v1/api/auth/account
export interface DeleteAccountResponse {
    success: true;
    message: string;
}

// 10. Client Session State (Ginagamit sa State Management sa Context API)
export interface AuthSession {
    user: AuthUser | null;
    token: string | null; // Bearer JWT token mula sa Supabase
    isAuthenticated: boolean;
    isLoading: boolean;
}