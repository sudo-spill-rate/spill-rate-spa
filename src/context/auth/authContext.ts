import { createContext } from "react";                                                           
import { AuthUser } from "../../types/auth";                                                     
                                                                                                    
export interface AuthContextType {                                                               
    user: AuthUser | null;                                                                       
    token: string | null;                                                                        
    isLoading: boolean;                                                                          
    isAuthenticated: boolean;                                                                    
    loginWithGoogle: (redirectTo?: string) => Promise<void>;                                     
    logout: () => void;                                                                          
    checkAuth: (explicitToken?: string) => Promise<boolean>;                                     
    refreshUser: () => Promise<void>;                                                            
    setToken: (token: string) => Promise<void>;                                                  
}                                                                                                
                                                                                                    
export const AuthContext = createContext<AuthContextType | undefined>(undefined);