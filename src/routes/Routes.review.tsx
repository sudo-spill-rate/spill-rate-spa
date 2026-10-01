import React from "react";                                                                                              
                                                                                                                        
// 1. Pages                                                                                                             
import PublicBusinessProfilePage from "../pages/ReviewPages/BusinessView/PublicBusinessProfilePage";                    
import WriteReviewPage from "../pages/ReviewPages/SubmitReview/WriteReviewPage";                                        
                                                                                                                        
// 2. Providers (Kailangan pareho ang Business at Review context)                                                       
import { BusinessProvider } from "../context/business/businessContextProvider";                                         
import { ReviewProvider } from "../context/review/reviewContextProvider";                                               
                                                                                                                        
export const ReviewRoutes = [                                                                                           
    // 1. Public Business View (Profile info + Customer reviews feed)                                                     
    {                                                                                                                     
    key: "business-public-view",                                                                                        
    path: "/business/:slug",                                                                                            
    element: (                                                                                                          
        <BusinessProvider>                                                                                                
        <ReviewProvider>                                                                                                
            <PublicBusinessProfilePage />                                                                                 
        </ReviewProvider>                                                                                               
        </BusinessProvider>                                                                                               
    ),                                                                                                                  
    },                                                                                                                    
                                                                                                                        
    // 2. Customer Review Submission Flow                                                                                 
    {                                                                                                                     
    key: "business-write-review",                                                                                       
    path: "/business/:businessId/write-review",                                                                         
    element: (                                                                                                          
        <BusinessProvider>                                                                                                
        <ReviewProvider>                                                                                                
            <WriteReviewPage />                                                                                           
        </ReviewProvider>                                                                                               
        </BusinessProvider>                                                                                               
    ),                                                                                                                  
    },                                                                                                                    
];                                                                                                                      
                                                                                                                        
export default ReviewRoutes;