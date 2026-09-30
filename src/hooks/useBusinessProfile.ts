import { useContext } from "react";                                                              
import { BusinessContext } from "../context/business/businessContext";                           
                                                                                                    
export const useBusinessProfile = () => {                                                        
    const context = useContext(BusinessContext);                                                 
                                                                                                    
    if (!context) {                                                                              
        throw new Error("useBusinessProfile must be used within a BusinessProvider");            
    }                                                                                            
                                                                                                    
    return {                                                                                     
        selectedBusiness: context.selectedBusiness,                                              
        isLoading: context.isLoading,                                                            
        isCreating: context.isCreating,                                                          
        error: context.error,                                                                    
        fetchBusinessBySlug: context.fetchBusinessBySlug,                                        
        createBusiness: context.createBusiness,                                                  
        clearSelectedBusiness: context.clearSelectedBusiness,                                    
    };                                                                                           
};                                                                                               
                                                                                                    
export default useBusinessProfile;