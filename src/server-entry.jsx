import React from "react";                                                                                   
import ReactDOMServer from "react-dom/server";                                                               
import { StaticRouter } from "react-router"; // o "react-router-dom/server" depende sa version               
                                                                                                                
import Routes from "./Routes";                                                                               
import "./index.css";                                                                                        
                                                                                                                
export function render(url, context = {}) {                                                                  
    return ReactDOMServer.renderToString(                                                                      
    <StaticRouter location={url} context={context}>                                                          
        <Routes />                                                                                             
    </StaticRouter>                                                                                          
    );                                                                                                         
}                                                                                                            
                                                                                                                
export default render; 