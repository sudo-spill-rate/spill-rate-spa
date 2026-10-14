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

    // 5. Post or Update Reply
    const postReply = async (
        reviewId: string,
        reply: string
    ): Promise<{ success: boolean; data?: any; message?: string }> => {
        try {
            setIsActionLoading(true);
            setActiveReviewId(reviewId);
            setActionError(null);

            const res = await manageReviewService.postReply(reviewId, reply);
            if (res.success && res.data) {
                return {
                    success: true,
                    data: res.data,
                    message: res.message || "Reply posted successfully!",
                };
            }

            setActionError(res.message || "Failed to post reply.");
            return { success: false, message: res.message };
        } catch (err: any) {
            const message = err?.message || "Failed to post reply.";
            setActionError(message);
            return { success: false, message };
        } finally {
            setIsActionLoading(false);
            setActiveReviewId(null);
        }
    };

    // 6. Delete Reply
    const deleteReply = async (
        reviewId: string
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            setIsActionLoading(true);
            setActiveReviewId(reviewId);
            setActionError(null);

            const res = await manageReviewService.deleteReply(reviewId);
            if (res.success) {
                return {
                    success: true,
                    message: res.message || "Reply deleted successfully.",
                };
            }

            setActionError(res.message || "Failed to delete reply.");
            return { success: false, message: res.message };
        } catch (err: any) {
            const message = err?.message || "Failed to delete reply.";
            setActionError(message);
            return { success: false, message };
        } finally {
            setIsActionLoading(false);
            setActiveReviewId(null);
        }
    };

    // 7. Fetch Flagged Reports
    const fetchReports = async (
        businessId: string
    ): Promise<{ success: boolean; data?: any[]; message?: string }> => {
        try {
            const res = await manageReviewService.getFlaggedReports(businessId);
            return {
                success: res.success,
                data: res.data,
                message: res.message,
            };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to fetch reports." };
        }
    };

    // 8. Update Report Status
    const updateReportStatus = async (
        reportId: string,
        status: any
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const res = await manageReviewService.updateReportStatus(reportId, status);
            return {
                success: res.success,
                message: res.message || "Report status updated.",
            };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to update report status." };
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
                postReply,
                deleteReply,
                fetchReports,
                updateReportStatus,                                                                                      
            }}                                                                                                     
        >                                                                                                          
            {children}                                                                                             
        </ManageReviewContext.Provider>                                                                            
    );                                                                                                             
};                                                                                                                 
                                                                                                                    
export default ManageReviewProvider;