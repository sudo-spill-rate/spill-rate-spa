import React, {                                                                                                    
    useState,                                                                                                      
    ReactNode,                                                                                                     
} from "react";                                                                                                    
import { ManageReviewContext } from "./manageReviewContext";                                                       
import { Review } from "../../types/review";                                                                       
import { manageReviewService } from "../../services/manageReviewService";                                          
                                                                                                                    
interface ManageReviewProviderProps {                                                                              
    children: ReactNode;                                                                                           
}                                                                                                                  
                                                                                                                    
export const ManageReviewProvider: React.FC<ManageReviewProviderProps> = ({ children }) => {                       
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);                                        
    const [activeReviewId, setActiveReviewId] = useState<string | null>(null);                                     
    const [actionError, setActionError] = useState<string | null>(null);                                           
                                                                                                                    
    // 1. Pin Review                                                                                               
    const pinReview = async (                                                                                      
        reviewId: string                                                                                           
    ): Promise<{ success: boolean; data?: Review; message?: string }> => {                                         
        try {                                                                                                      
            setIsActionLoading(true);                                                                              
            setActiveReviewId(reviewId);                                                                           
            setActionError(null);                                                                                  
                                                                                                                    
            const res = await manageReviewService.pinReview(reviewId);                                             
                                                                                                                    
            if (res.success && res.data) {                                                                         
                return {                                                                                           
                    success: true,                                                                                 
                    data: res.data,                                                                                
                    message: res.message || "Review pinned successfully!",                                         
                };                                                                                                 
            }                                                                                                      
                                                                                                                    
            setActionError(res.message || "Failed to pin review.");                                                
            return { success: false, message: res.message };                                                       
        } catch (err: any) {                                                                                       
            const message = err?.message || "Failed to pin review.";                                               
            setActionError(message);                                                                               
            return { success: false, message };                                                                    
        } finally {                                                                                                
            setIsActionLoading(false);                                                                             
            setActiveReviewId(null);                                                                               
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    // 2. Unpin Review                                                                                             
    const unpinReview = async (                                                                                    
        reviewId: string                                                                                           
    ): Promise<{ success: boolean; data?: Review; message?: string }> => {                                         
        try {                                                                                                      
            setIsActionLoading(true);                                                                              
            setActiveReviewId(reviewId);                                                                           
            setActionError(null);                                                                                  
                                                                                                                    
            const res = await manageReviewService.unpinReview(reviewId);                                           
                                                                                                                    
            if (res.success && res.data) {                                                                         
                return {                                                                                           
                    success: true,                                                                                 
                    data: res.data,                                                                                
                    message: res.message || "Review unpinned successfully!",                                       
                };                                                                                                 
            }                                                                                                      
                                                                                                                    
            setActionError(res.message || "Failed to unpin review.");                                              
            return { success: false, message: res.message };                                                       
        } catch (err: any) {                                                                                       
            const message = err?.message || "Failed to unpin review.";                                             
            setActionError(message);                                                                               
            return { success: false, message };                                                                    
        } finally {                                                                                                
            setIsActionLoading(false);                                                                             
            setActiveReviewId(null);                                                                               
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    // 3. Toggle Visibility                                                                                        
    const toggleVisibility = async (                                                                               
        reviewId: string,                                                                                          
        is_private: boolean                                                                                        
    ): Promise<{ success: boolean; data?: Review; message?: string }> => {                                         
        try {                                                                                                      
            setIsActionLoading(true);                                                                              
            setActiveReviewId(reviewId);                                                                           
            setActionError(null);                                                                                  
                                                                                                                    
            const res = await manageReviewService.toggleVisibility(reviewId, is_private);                          
                                                                                                                    
            if (res.success && res.data) {                                                                         
                return {                                                                                           
                    success: true,                                                                                 
                    data: res.data,                                                                                
                    message: res.message || "Visibility updated successfully!",                                    
                };                                                                                                 
            }                                                                                                      
                                                                                                                    
            setActionError(res.message || "Failed to update visibility.");                                         
            return { success: false, message: res.message };                                                       
        } catch (err: any) {                                                                                       
            const message = err?.message || "Failed to update visibility.";                                        
            setActionError(message);                                                                               
            return { success: false, message };                                                                    
        } finally {                                                                                                
            setIsActionLoading(false);                                                                             
            setActiveReviewId(null);                                                                               
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    // 4. Delete Review                                                                                            
    const deleteReview = async (                                                                                   
        reviewId: string                                                                                           
    ): Promise<{ success: boolean; message?: string }> => {                                                        
        try {                                                                                                      
            setIsActionLoading(true);                                                                              
            setActiveReviewId(reviewId);                                                                           
            setActionError(null);                                                                                  
                                                                                                                    
            const res = await manageReviewService.deleteReview(reviewId);                                          
                                                                                                                    
            if (res.success) {                                                                                     
                return {                                                                                           
                    success: true,                                                                                 
                    message: res.message || "Review deleted successfully.",                                        
                };                                                                                                 
            }                                                                                                      
                                                                                                                    
            setActionError(res.message || "Failed to delete review.");                                             
            return { success: false, message: res.message };                                                       
        } catch (err: any) {                                                                                       
            const message = err?.message || "Failed to delete review.";                                            
            setActionError(message);                                                                               
            return { success: false, message };                                                                    
        } finally {                                                                                                
            setIsActionLoading(false);                                                                             
            setActiveReviewId(null);                                                                               
        }                                                                                                          
    };                                                                                                             
                                                                                                                    
    return (                                                                                                       
        <ManageReviewContext.Provider                                                                              
            value={{                                                                                               
                isActionLoading,                                                                                   
                activeReviewId,                                                                                    
                actionError,                                                                                       
                pinReview,                                                                                         
                unpinReview,                                                                                       
                toggleVisibility,                                                                                  
                deleteReview,                                                                                      
            }}                                                                                                     
        >                                                                                                          
            {children}                                                                                             
        </ManageReviewContext.Provider>                                                                            
    );                                                                                                             
};                                                                                                                 
                                                                                                                    
export default ManageReviewProvider;