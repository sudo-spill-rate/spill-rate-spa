import { api } from "../lib/api";                                                                                  
import { Review } from "../types/review";                                                                          
import {                                                                                                           
    ToggleVisibilityPayload,                                                                                       
    PinReviewResponse,                                                                                             
    UnpinReviewResponse,                                                                                           
    ToggleVisibilityResponse,                                                                                      
    DeleteReviewResponse,
    ManageReviewQuery,
    ManageReviewListResponse,
    ReplyReviewData,
    ReplyReviewResponse,
    DeleteReplyResponse,
    BusinessFlaggedReport,
    FlaggedReportsResponse,
    UpdateReportStatusResponse,
    ReportStatus,                                                                                    
} from "../types/managereview";                                                                                    
import { ApiResponse, ApiActionResponse, PaginatedApiResponse } from "../types/api";                                                     
                                                                                                                    
class ManageReviewService {
    /**
     * Kumuha ng lahat ng reviews para sa Business Owner (suportado ang all, public, private, pinned filters)
     * GET /v1/api/review/manage/:businessId
     */
    async getManageReviews(
        businessId: string,
        query?: ManageReviewQuery
    ): Promise<PaginatedApiResponse<Review>> {
        try {
            const params = new URLSearchParams();
            if (query?.filter) params.append("filter", query.filter);
            if (query?.cursor) params.append("cursor", query.cursor);
            if (query?.limit) params.append("limit", String(query.limit));

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await api.get<ManageReviewListResponse>(
                `/review/manage/${encodeURIComponent(businessId)}${queryString}`
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
                message: error.response?.data?.message || error.message || "Failed to fetch management reviews",
            };
        }
    }                                                                                        
                                                                                                                    
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

    /**
     * Mag-post o mag-update ng opisyal na tugon ng Business Owner
     * POST /v1/api/review/:reviewId/reply
     */
    async postReply(
        reviewId: string,
        reply: string
    ): Promise<ApiResponse<ReplyReviewData | null>> {
        try {
            const response = await api.post<ReplyReviewResponse>(
                `/review/${encodeURIComponent(reviewId)}/reply`,
                { reply: reply.trim() }
            );

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Reply posted successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to post reply",
            };
        }
    }

    /**
     * Tanggalin ang opisyal na tugon ng may-ari
     * DELETE /v1/api/review/:reviewId/reply
     */
    async deleteReply(reviewId: string): Promise<ApiActionResponse> {
        try {
            const response = await api.delete<DeleteReplyResponse>(
                `/review/${encodeURIComponent(reviewId)}/reply`
            );

            return {
                success: true,
                message: response.data.message || "Reply deleted successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to delete reply",
            };
        }
    }

    /**
     * Tingnan ang lahat ng flagged reports para sa negosyong ito
     * GET /v1/api/review/manage/:businessId/reports
     */
    async getFlaggedReports(businessId: string): Promise<ApiResponse<BusinessFlaggedReport[]>> {
        try {
            const response = await api.get<FlaggedReportsResponse>(
                `/review/manage/${encodeURIComponent(businessId)}/reports`
            );

            return {
                success: true,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch reports",
            };
        }
    }

    /**
     * Baguhin ang status ng flagged report (resolved, dismissed, pending)
     * PATCH /v1/api/review/manage/report/:reportId
     */
    async updateReportStatus(
        reportId: string,
        status: ReportStatus
    ): Promise<ApiResponse<{ id: string; status: ReportStatus } | null>> {
        try {
            const response = await api.patch<UpdateReportStatusResponse>(
                `/review/manage/report/${encodeURIComponent(reportId)}`,
                { status }
            );

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Report status updated.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to update report status",
            };
        }
    }                                                                                                              
}                                                                                                                  
                                                                                                                    
export const manageReviewService = new ManageReviewService();                                                      
export default manageReviewService;