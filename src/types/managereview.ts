/**                                                                                              
 * manageReview.ts                                                                               
 * Type definitions para sa Review Moderation & Management ng Business Owner                     
 */                                                                                              
import { Review } from './review';                                                               
                                                                                                    
// 1. Actions na puwedeng gawin ng Business Owner sa bawat Review                                
export type ReviewModerationAction = 'pin' | 'unpin' | 'hide' | 'show' | 'delete';               
                                                                                                    
// 2. Payload para sa pagbabago ng visibility (PATCH /v1/api/review/:reviewId/visibility)        
export interface ToggleVisibilityPayload {                                                       
    is_private: boolean; // true = itago sa public; false = ilantad sa public                    
}                                                                                                
                                                                                                    
// 3. Response mula sa Pinning (PATCH /v1/api/review/:reviewId/pin)                              
export interface PinReviewResponse {                                                             
    success: true;                                                                               
    data: Review; // Updated review (is_pinned: true, is_private: false, pinned_at: timestamp)   
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 4. Response mula sa Unpinning (PATCH /v1/api/review/:reviewId/unpin)                          
export interface UnpinReviewResponse {                                                           
    success: true;                                                                               
    data: Review; // Updated review (is_pinned: false)                                           
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 5. Response mula sa Visibility Toggle (PATCH /v1/api/review/:reviewId/visibility)             
export interface ToggleVisibilityResponse {                                                      
    success: true;                                                                               
    data: Review; // Updated review (is_private: true/false, may unpin kung ginawang private)    
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 6. Response mula sa Pagbura ng Review (DELETE /v1/api/review/:reviewId)                       
export interface DeleteReviewResponse {                                                          
    success: true;                                                                               
    message: string; // "Review deleted successfully."                                           
}                                                                                                
                                                                                                    
// 7. Ownership Error Responses (Kapag hindi ang may-ari ng negosyo ang tumawag)                 
export interface OwnershipForbiddenError {                                                       
    success: false;                                                                              
    message: 'Forbidden: You are not authorized to manage reviews for this business.';           
}

// 8. Management Reviews Query & List (GET /v1/api/review/manage/:businessId)
export type ManageReviewFilter = 'all' | 'public' | 'private' | 'pinned';

export interface ManageReviewQuery {
    filter?: ManageReviewFilter;
    limit?: number;
    cursor?: string;
}

export interface ManageReviewListResponse {
    success: true;
    data: Review[];
    pagination: {
        limit: number;
        has_more: boolean;
        next_cursor?: string | null;
    };
    message?: string;
}

// 9. Owner Official Reply Types (POST & DELETE /v1/api/review/:reviewId/reply)
export interface PostReplyPayload {
    reply: string;
}

export interface ReplyReviewData {
    id: string;
    reply_comment: string;
    replied_at: string;
}

export interface ReplyReviewResponse {
    success: true;
    message: string;
    data: ReplyReviewData;
}

export interface DeleteReplyResponse {
    success: true;
    message: string;
}

// 10. Flagged Reports Management (GET /manage/:businessId/reports & PATCH /manage/report/:reportId)
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface BusinessFlaggedReport {
    id: string;
    review_id: string;
    reason: string;
    details?: string;
    status: ReportStatus;
    created_at: string;
    review?: Review;
}

export interface FlaggedReportsResponse {
    success: true;
    data: BusinessFlaggedReport[];
    message?: string;
}

export interface UpdateReportStatusResponse {
    success: true;
    message: string;
    data: {
        id: string;
        status: ReportStatus;
    };
}    