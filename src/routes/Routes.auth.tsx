// src/routes/Routes.auth.tsx                                                                                
import React from "react";                                        
import OAuthCallbackPage from "../pages/SignInPages/OAuthCallBack/OAuthCallbackPage";                                            
import { AuthProvider } from "../context/auth/authContextProvider";                                          
import SignInPage from "../pages/SignInPages/SignIn/SignInPage";
                                                                                                                
export const AuthRoutes = [                                                                                  
    {                                                                                                          
    key: "/login",                                                                                           
    path: "/login",                                                                                          
    element: (                                                                                               
        <AuthProvider>                                                                                         
            <SignInPage />                                                                                       
        </AuthProvider>                                                                                        
    ),                                                                                                       
    },                                                                                                         
    {                                                                                                          
    key: "/oauth/callback",                                                                                  
    path: "/oauth/callback",                                                                                 
    element: (                                                                                               
        <AuthProvider>                                                                                         
            <OAuthCallbackPage />                                                                                
        </AuthProvider>                                                                                        
    ),                                                                                                       
    },                                                                                                         
];                                                                                                           
                                                                                                                
export default AuthRoutes; 