import { createContext } from "react";
import { AuthUser, UpdateProfilePayload } from "../../types/auth";

export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    loginWithGoogle: (redirectTo?: string) => Promise<void>;
    handleOAuthCode: (code: string) => Promise<{ success: boolean; message?: string }>;
    updateProfile: (payload: UpdateProfilePayload) => Promise<{ success: boolean; user?: AuthUser; message?: string }>;
    deleteAccount: () => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkAuth: (explicitToken?: string) => Promise<boolean>;
    refreshUser: () => Promise<void>;
    setToken: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);