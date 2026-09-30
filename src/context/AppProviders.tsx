import React, { ReactNode } from "react";                                                        
import { AuthProvider } from "./auth/authContextProvider";                                       
import { BusinessProvider } from "./business/businessContextProvider";                           
import { ReviewProvider } from "./review/reviewContextProvider";                                 
import { ManageReviewProvider } from "./manageReview/manageReviewContextProvider";               
                                                                                                    
interface AppProvidersProps {                                                                    
    children: ReactNode;                                                                         
}                                                                                                
                                                                                                    
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {                     
    return (                                                                                     
        <AuthProvider>                                                                           
            <BusinessProvider>                                                                   
                <ReviewProvider>                                                                 
                    <ManageReviewProvider>                                                       
                        {children}                                                               
                    </ManageReviewProvider>                                                      
                </ReviewProvider>                                                                
            </BusinessProvider>                                                                  
        </AuthProvider>                                                                          
    );                                                                                           
};                                                                                               
                                                                                                    
export default AppProviders;