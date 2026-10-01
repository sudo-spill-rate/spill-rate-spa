import React from "react";                                                                                              
                                                                                                                        
// Mga Pages mula sa BusinessPages/ folder                                                                              
import BusinessDashboardPage from "../pages/BusinessPages/Dashboard/BusinessDashboardPage";                             
import BusinessManageProfilePage from "../pages/BusinessPages/Profile/BusinessManageProfilePage";                       
import CreateBusinessPage from "../pages/BusinessPages/CreateBusiness/CreateBusinessPage";                              
                                                                                                                        
// Providers para sa Business Owner                                                                                     
import { BusinessProvider } from "../context/business/businessContextProvider";                                         
import { ManageReviewProvider } from "../context/manageReview/manageReviewContextProvider";                             
                                                                                                                        
export const BusinessRoutes = [                                                                                         
    {                                                                                                                     
    key: "owner-dashboard",                                                                                             
    path: "/dashboard",                                                                                                 
    element: (                                                                                                          
        <BusinessProvider>                                                                                                
        <BusinessDashboardPage />                                                                                       
        </BusinessProvider>                                                                                               
    ),                                                                                                                  
    },                                                                                                                    
    {                                                                                                                     
    key: "owner-create-business",                                                                                       
    path: "/dashboard/business/new",                                                                                    
    element: (                                                                                                          
        <BusinessProvider>                                                                                                
        <CreateBusinessPage />                                                                                          
        </BusinessProvider>                                                                                               
    ),                                                                                                                  
    },                                                                                                                    
    {                                                                                                                     
    key: "owner-manage-business",                                                                                       
    path: "/dashboard/business/:id",                                                                                    
    element: (                                                                                                          
        <BusinessProvider>                                                                                                
        <ManageReviewProvider>                                                                                          
            <BusinessManageProfilePage />                                                                                 
        </ManageReviewProvider>                                                                                         
        </BusinessProvider>                                                                                               
    ),                                                                                                                  
    },                                                                                                                    
];