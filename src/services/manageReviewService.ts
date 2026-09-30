import { api } from "../lib/api";                                                                                  
import { Review } from "../types/review";                                                                          
import {                                                                                                           
    ToggleVisibilityPayload,                                                                                       
    PinReviewResponse,                                                                                             
    UnpinReviewResponse,                                                                                           
    ToggleVisibilityResponse,                                                                                      
    DeleteReviewResponse,                                                                                          
} from "../types/managereview";                                                                                    
import { ApiResponse, ApiActionResponse } from "../types/api";                                                     
                                                                                                                    
class ManageReviewService {                                                                                        
    /**                                                                                                            
     * I-pin ang review sa pinakatuktok ng profile (Awtomatiko ring nagiging public)                               
     * PATCH /v1/api/review/:reviewId/pin                                                                          
     */                                                                                                            
    async pinReview(reviewId: string): Promise<ApiResponse<Review | null>> {                                       
        try {                                                                                                      
            const response = await api.patch<PinReviewResponse>(                                                   
                `/review/${encodeURIComponent(reviewId)}/pin`                                                      
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                data: response.data.data,                                                                          
                message: response.data.message || "Review pinned successfully!",                                   
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: null,                                                                                        
                message: error.response?.data?.message || error.message || "Failed to pin review",                 
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
                                                                                                                    
    /**                                                                                                            
     * I-unpin ang review                                                                                          
     * PATCH /v1/api/review/:reviewId/unpin                                                                        
     */                                                                                                            
    async unpinReview(reviewId: string): Promise<ApiResponse<Review | null>> {                                     
        try {                                                                                                      
            const response = await api.patch<UnpinReviewResponse>(                                                 
                `/review/${encodeURIComponent(reviewId)}/unpin`                                                    
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                data: response.data.data,                                                                          
                message: response.data.message || "Review unpinned successfully!",                                 
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: null,                                                                                        
                message: error.response?.data?.message || error.message || "Failed to unpin review",               
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
                                                                                                                    
    /**                                                                                                            
     * I-toggle ang visibility (itago o ilantad sa public feed)                                                    
     * PATCH /v1/api/review/:reviewId/visibility                                                                   
     */                                                                                                            
    async toggleVisibility(                                                                                        
        reviewId: string,                                                                                          
        is_private: boolean                                                                                        
    ): Promise<ApiResponse<Review | null>> {                                                                       
        try {                                                                                                      
            const payload: ToggleVisibilityPayload = { is_private };                                               
            const response = await api.patch<ToggleVisibilityResponse>(                                            
                `/review/${encodeURIComponent(reviewId)}/visibility`,                                              
                payload                                                                                            
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                data: response.data.data,                                                                          
                message: response.data.message || "Review visibility updated successfully!",                       
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: null,                                                                                        
                message: error.response?.data?.message || error.message || "Failed to update review visibility",   
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
                                                                                                                    
    /**                                                                                                            
     * Burahin ang review at linisin ang mga kaugnay na Cloudinary images                                          
     * DELETE /v1/api/review/:reviewId                                                                             
     */                                                                                                            
    async deleteReview(reviewId: string): Promise<ApiActionResponse> {                                             
        try {                                                                                                      
            const response = await api.delete<DeleteReviewResponse>(                                               
                `/review/${encodeURIComponent(reviewId)}`                                                          
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                message: response.data.message || "Review deleted successfully.",                                  
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                message: error.response?.data?.message || error.message || "Failed to delete review",              
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
}                                                                                                                  
                                                                                                                    
export const manageReviewService = new ManageReviewService();                                                      
export default manageReviewService;