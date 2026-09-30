import React, {                                                                                                    
    useState,                                                                                                      
    useEffect,                                                                                                     
    ReactNode,                                                                                                     
    useRef,                                                                                                        
    useCallback,                                                                                                   
} from "react";                                                                                                    
import { AuthContext } from "./authContext";                                                                       
import { AuthUser } from "../../types/auth";                                                                       
import { authService } from "../../services/authService";                                                          
                                                                                                                    
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
                                                                                                                    
    // Kumuha ng user profile gamit ang authService                                                                
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
                updateAuthState(false, null, null);                                                                
                return false;                                                                                      
            }                                                                                                      
                                                                                                                    
            const response = await authService.getMe();                                                            
                                                                                                                    
            if (response.success && response.data) {                                                               
                localStorage.setItem("accessToken", currentToken);                                                 
                updateAuthState(true, response.data, currentToken);                                                
                return true;                                                                                       
            }                                                                                                      
                                                                                                                    
            throw new Error(response.message || "Failed to authenticate");                                         
        } catch (error: any) {                                                                                     
            localStorage.removeItem("accessToken");                                                                
            sessionStorage.removeItem("accessToken");                                                              
            updateAuthState(false, null, null);                                                                    
            return false;                                                                                          
        } finally {                                                                                                
            setIsLoading(false);                                                                                   
            isCheckingRef.current = false;                                                                         
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    // Google OAuth redirection gamit ang authService                                                              
    const loginWithGoogle = async (redirectTo?: string): Promise<void> => {                                        
        try {                                                                                                      
            setIsLoading(true);                                                                                    
            const response = await authService.getGoogleAuthUrl(redirectTo);                                       
                                                                                                                    
            if (response.success && response.data.url) {                                                           
                window.location.href = response.data.url;                                                          
            } else {                                                                                               
                throw new Error(response.message || "Failed to retrieve Google OAuth URL");                        
            }                                                                                                      
        } catch (error: any) {                                                                                     
            console.error("Google login error:", error.message);                                                   
            setIsLoading(false);                                                                                   
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    const setToken = async (newToken: string): Promise<void> => {                                                  
        localStorage.setItem("accessToken", newToken);                                                             
        await checkAuth(newToken);                                                                                 
    };                                                                                                             
                                                                                                                    
    const logout = (): void => {                                                                                   
        localStorage.removeItem("accessToken");                                                                    
        sessionStorage.removeItem("accessToken");                                                                  
        updateAuthState(false, null, null);                                                                        
    };                                                                                                             
                                                                                                                    
    const refreshUser = async (): Promise<void> => {                                                               
        await checkAuth();                                                                                         
    };                                                                                                             
                                                                                                                    
    useEffect(() => {                                                                                              
        const handleOAuthRedirect = async () => {                                                                  
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
                                                                                                                    
        handleOAuthRedirect();                                                                                     
    }, []);                                                                                                        
                                                                                                                    
    return (                                                                                                       
        <AuthContext.Provider                                                                                      
            value={{                                                                                               
                user,                                                                                              
                token,                                                                                             
                isLoading,                                                                                         
                isAuthenticated,                                                                                   
                loginWithGoogle,                                                                                   
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