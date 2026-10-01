import React, { useEffect, useState } from "react";                                 
import { Outlet } from "react-router";                                              
import PublicNavbar from "./PublicNavbar";                                          
import PublicFooter from "./PublicFooter";                                          
                                                                                    
export default function PublicLayout() {                                            
    return (                                                                          
    <div>                                                                           
        <PublicNavbar />                                                              
        <main>                                                                        
        <h1>Public Layout Shell - Lorem Ipsum</h1>                                  
        <Outlet />                                                                  
        </main>                                                                       
        <PublicFooter />                                                              
    </div>                                                                          
    );                                                                                
} 