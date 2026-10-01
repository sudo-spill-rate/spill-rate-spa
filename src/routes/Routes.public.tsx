import React from "react";                                                          
import LandingPage from "../pages/PublicPages/Landing/LandingPage";                
import ExploreDirectoryPage from "../pages/PublicPages/Explore/ExploreDirectoryPage";
import AboutPage from "../pages/PublicPages/About/AboutPage";                     
import ContactPage from "../pages/PublicPages/Contact/ContactPage";             
import FAQPage from "../pages/PublicPages/FAQ/FAQPage";                          
import PrivacyPolicyPage from "../pages/PublicPages/Legal/PrivacyPolicyPage";
import TermsAndConditionsPage from "../pages/PublicPages/Legal/TermsAndConditionsPage";                                   
                                                                                    
export const PublicRoutes = [                                                       
    {                                                                                 
    key: "landing",                                                                 
    path: "/",                                                                      
    element: <LandingPage />,                                                       
    },                                                                                
    {                                                                                 
    key: "explore-directory",                                                       
    path: "/explore",                                                               
    element: <ExploreDirectoryPage />,                                              
    },                                                                                
    {                                                                                 
    key: "about-us",                                                                
    path: "/about",                                                                 
    element: <AboutPage />,                                                         
    },                                                                                
    {                                                                                 
    key: "contact-us",                                                              
    path: "/contact",                                                               
    element: <ContactPage />,                                                       
    },                                                                                
    {                                                                                 
    key: "faq",                                                                     
    path: "/faq",                                                                   
    element: <FAQPage />,                                                           
    },                                                                                
    {                                                                                 
    key: "privacy-policy",                                                          
    path: "/privacy-policy",                                                        
    element: <PrivacyPolicyPage />,                                                 
    },                                                                                
    {                                                                                 
    key: "terms-and-conditions",                                                    
    path: "/terms",                                                                 
    element: <TermsAndConditionsPage />,                                            
    },                                                                                
];     