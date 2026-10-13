import React, { ReactNode } from "react";                                                                    
import { Navigate, Outlet, useLocation } from "react-router-dom"; // o "react-router"                        
import { useUserAuth } from "../hooks";                                                                      
                                                                                                                
interface ProtectedRouteProps {                                                                              
    children?: ReactNode;                                                                                    
}                                                                                                            
                                                                                                                
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {                             
    const { isAuthenticated, isLoading } = useUserAuth();                                                    
    const location = useLocation();                                                                          
                                                                                                              
    if (isLoading) {                                                                                         
        return (                                                                                             
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>                                                                                                            
                <p>Verifying session...</p>                                                                  
            </div>                                                                                           
        );                                                                                                   
    }                                                                                                        
                                                                                                 
    if (!isAuthenticated) {                                                                                  
        return <Navigate to="/?signin=true" state={{ from: location }} replace />;                                  
    }                                                                                                        
                                                                                                            
    return children ? <>{children}</> : <Outlet />;                                                          
};                                                                                                           
                                                                                                                
export default ProtectedRoute;