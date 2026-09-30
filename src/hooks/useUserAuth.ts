import { useContext } from "react";                                                              
import { AuthContext } from "../context/auth/authContext";                                       
                                                                                                    
export const useUserAuth = () => {                                                               
    const context = useContext(AuthContext);                                                     
                                                                                                    
    if (!context) {                                                                              
        throw new Error("useUserAuth must be used within an AuthProvider");                      
    }                                                                                            
                                                                                                    
    return {                                                                                     
        user: context.user,                                                                      
        token: context.token,                                                                    
        isAuthenticated: context.isAuthenticated,                                                
        isLoading: context.isLoading,                                                            
        loginWithGoogle: context.loginWithGoogle,                                                
        logout: context.logout,                                                                  
        checkAuth: context.checkAuth,                                                            
        refreshUser: context.refreshUser,                                                        
        setToken: context.setToken,                                                              
    };                                                                                           
};                                                                                               
                                                                                                    
export default useUserAuth;