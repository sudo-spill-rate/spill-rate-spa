import { api } from "../lib/api";                                                                                  
import {                                                                                                           
    Review,                                                                                                        
    CreateReviewPayload,                                                                                           
    ReviewListQuery,                                                                                               
    ReviewListResponse,
    ReviewSummaryData,
    ReviewVoteData,
    ReportReviewPayload,
    ReportReviewResponseData,                                                                                            
} from "../types/review";                                                                                          
import { CheckEligibilityResponse } from "../types/eligibility";                                                   
import { ApiResponse, PaginatedApiResponse } from "../types/api";                                                  
                                                                                                                    
class ReviewService {                                                                                              
    /**                                                                                                            
     * Pre-flight Check: Tingnan kung puwede nang mag-iwan ng review ang client (24-hr cooldown)                   
     * GET /v1/api/review/:slug/eligibility                                                                        
     */                                                                                                            
    async checkEligibility(                                                                                        
        slug: string,                                                                                              
        deviceId?: string                                                                                          
    ): Promise<ApiResponse<CheckEligibilityResponse | null>> {                                                     
        try {                                                                                                      
            const query = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : "";                            
            const response = await api.get<CheckEligibilityResponse>(                                              
                `/review/${encodeURIComponent(slug)}/eligibility${query}`                                          
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                data: response.data,                                                                               
                message: response.data.message,                                                                    
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: null,                                                                                        
                message: error.response?.data?.message || error.message || "Failed to check review eligibility",   
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
                                                                                                                    
    /**                                                                                                            
     * Kumuha ng public reviews ng negosyo na may star filter at cursor pagination                                 
     * GET /v1/api/review/:slug                                                                                    
     */                                                                                                            
    async getReviews(                                                                                              
        slug: string,                                                                                              
        query?: ReviewListQuery                                                                                    
    ): Promise<PaginatedApiResponse<Review>> {                                                                     
        try {                                                                                                      
            const params = new URLSearchParams();                                                                  
            if (query?.rating) params.append("rating", String(query.rating));                                      
            if (query?.cursor) params.append("cursor", query.cursor);                                              
            if (query?.limit) params.append("limit", String(query.limit));                                         
                                                                                                                    
            const queryString = params.toString() ? `?${params.toString()}` : "";                                  
            const response = await api.get<ReviewListResponse>(                                                    
                `/review/${encodeURIComponent(slug)}${queryString}`                                                
            );                                                                                                     
                                                                                                                    
            return {                                                                                               
                success: true,                                                                                     
                data: response.data.data || [],                                                                    
                pagination: response.data.pagination,                                                              
                message: response.data.message,                                                                    
            };                                                                                                     
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: [],                                                                                          
                pagination: { limit: 10, has_more: false, next_cursor: null },                                     
                message: error.response?.data?.message || error.message || "Failed to fetch reviews",              
            };                                                                                                     
        }                                                                                                          
    }                                                                                                              
                                                                                                                    
    /**                                                                                                            
     * Magsumite ng review gamit ang FormData (May suporta para sa hanggang 3 litrato)                             
     * POST /v1/api/review/:slug                                                                                   
     */                                                                                                            
    async submitReview(                                                                                            
        slug: string,                                                                                              
        payload: CreateReviewPayload                                                                               
    ): Promise<ApiResponse<Review | null>> {                                                                       
        try {                                                                                                      
            const formData = new FormData();                                                                       
            formData.append("name", payload.name.trim());                                                          
            formData.append("rating", String(payload.rating));                                                     
            formData.append("comment", payload.comment.trim());                                                    
                                                                                                                    
            if (payload.device_id) {                                                                               
                formData.append("device_id", payload.device_id.trim());                                            
            }                                                                                                      
                                                                                                                    
            if (payload.reviewer_business_id) {                                                                    
                formData.append("reviewer_business_id", payload.reviewer_business_id.trim());                      
            }                                                                                                      
                                                                                                                    
            // Maglakip ng hanggang 3 litrato (Kung mayroon)                                                       
            if (payload.images && payload.images.length > 0) {                                                     
                payload.images.slice(0, 3).forEach((file) => {                                                     
                    formData.append("images", file);                                                               
                });                                                                                                
            }                                                                                                      
                                                                                                                    
            const response = await api.post<ApiResponse<Review>>(                                                  
                `/review/${encodeURIComponent(slug)}`,                                                             
                formData                                                                                           
            );                                                                                                     
                                                                                                                    
            return response.data;                                                                                  
        } catch (error: any) {                                                                                     
            return {                                                                                               
                success: false,                                                                                    
                data: null,                                                                                        
                message: error.response?.data?.message || error.message || "Failed to submit review",              
            };                                                                                                     
        }                                                                                                          
    }

    /**
     * Kumuha ng star distribution breakdown & rating summary
     * GET /v1/api/review/:id/summary
     */
    async getReviewSummary(id: string): Promise<ApiResponse<ReviewSummaryData | null>> {
        try {
            const response = await api.get<{ success: boolean; data: ReviewSummaryData; message?: string }>(
                `/review/${encodeURIComponent(id)}/summary`
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch review summary",
            };
        }
    }

    /**
     * Kumuha ng detalye ng isang review
     * GET /v1/api/review/detail/:reviewId
     */
    async getReviewDetail(reviewId: string): Promise<ApiResponse<Review | null>> {
        try {
            const response = await api.get<{ success: boolean; data: Review; message?: string }>(
                `/review/detail/${encodeURIComponent(reviewId)}`
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch review detail",
            };
        }
    }

    /**
     * I-toggle ang "Helpful" upvote sa review (+1 / -1)
     * POST /v1/api/review/:reviewId/vote
     */
    async toggleHelpfulVote(reviewId: string): Promise<ApiResponse<ReviewVoteData | null>> {
        try {
            const response = await api.post<{ success: boolean; data: ReviewVoteData; message?: string }>(
                `/review/${encodeURIComponent(reviewId)}/vote`
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Helpful vote updated.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to toggle helpful vote",
            };
        }
    }

    /**
     * I-report ang isang review (spam, offensive, fake, conflict of interest)
     * POST /v1/api/review/:reviewId/report
     */
    async reportReview(
        reviewId: string,
        payload: ReportReviewPayload
    ): Promise<ApiResponse<ReportReviewResponseData | null>> {
        try {
            const response = await api.post<{ success: boolean; data: ReportReviewResponseData; message?: string }>(
                `/review/${encodeURIComponent(reviewId)}/report`,
                payload
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Review reported successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to submit review report",
            };
        }
    }                                                                                                              
}                                                                                                                  
                                                                                                                    
export const reviewService = new ReviewService();                                                                  
export default reviewService;