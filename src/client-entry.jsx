import { StrictMode } from "react";                                                                          
import { createRoot } from "react-dom/client";                                                               
import { BrowserRouter } from "react-router";                                                                
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";                                                             
                                                                                                                
import Routes from "./Routes.tsx";                                                                           
import "./index.css";                                                                                        
                                                                                                                
createRoot(document.getElementById("root")).render(                                                          
    <StrictMode>                                                                                               
    <BrowserRouter>                                                                                          
        <ToastContainer                                                                                        
        position="top-right"                                                                                 
        autoClose={3000}                                                                                     
        hideProgressBar={false}                                                                              
        newestOnTop={false}                                                                                  
        closeOnClick                                                                                         
        rtl={false}                                                                                          
        pauseOnFocusLoss                                                                                     
        draggable                                                                                            
        pauseOnHover                                                                                         
        />                                                                                                     
        <Routes />                                                                                             
    </BrowserRouter>                                                                                         
    </StrictMode>                                                                                              
);