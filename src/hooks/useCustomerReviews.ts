import { useContext } from "react";                                                              
import { ReviewContext } from "../context/review/reviewContext";                                 
                                                                                                    
export const useCustomerReviews = () => {                                                        
    const context = useContext(ReviewContext);                                                   
                                                                                                    
    if (!context) {                                                                              
        throw new Error("useCustomerReviews must be used within a ReviewProvider");              
    }                                                                                            
                                                                                                    
    return {                                                                                     
        reviews: context.reviews,                                                                
        eligibility: context.eligibility,                                                        
        pagination: context.pagination,                                                          
        isLoadingReviews: context.isLoadingReviews,                                              
        isLoadingMore: context.isLoadingMore,                                                    
        isCheckingEligibility: context.isCheckingEligibility,                                    
        isSubmitting: context.isSubmitting,                                                      
        error: context.error,                                                                    
        checkEligibility: context.checkEligibility,                                              
        fetchReviews: context.fetchReviews,                                                      
        loadMoreReviews: context.loadMoreReviews,                                                
        submitReview: context.submitReview,                                                      
        clearReviews: context.clearReviews,                                                      
    };                                                                                           
};                                                                                               
                                                                                                    
export default useCustomerReviews;