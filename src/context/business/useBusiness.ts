import { useContext } from "react";                                                              
import { BusinessContext, BusinessContextType } from "./businessContext";                        
                                                                                                    
export const useBusiness = (): BusinessContextType => {                                          
    const context = useContext(BusinessContext);                                                 
    if (!context) {                                                                              
        throw new Error("useBusiness must be used within a BusinessProvider");                   
    }                                                                                            
    return context;                                                                              
};                                                                                               
                                                                                                    
export default useBusiness;