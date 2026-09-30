import { useContext } from "react";                                                              
import { BusinessContext } from "../context/business/businessContext";                           
                                                                                                    
export const useBusinessDirectory = () => {                                                      
    const context = useContext(BusinessContext);                                                 
                                                                                                    
    if (!context) {                                                                              
        throw new Error("useBusinessDirectory must be used within a BusinessProvider");          
    }                                                                                            
                                                                                                    
    return {                                                                                     
        businesses: context.businesses,                                                          
        pagination: context.pagination,                                                          
        isLoading: context.isLoading,                                                            
        isLoadingMore: context.isLoadingMore,                                                    
        error: context.error,                                                                    
        fetchBusinesses: context.fetchBusinesses,                                                
        loadMoreBusinesses: context.loadMoreBusinesses,                                          
    };                                                                                           
};                                                                                               
                                                                                                    
export default useBusinessDirectory;