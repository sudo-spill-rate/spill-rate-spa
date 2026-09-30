/**                                                                                              
 * review.ts                                                                                     
 * Type definitions para sa Reviews, Submissions, at Public Review Feeds                         
 */                                                                                              
import { PaginationMeta } from './api';                                                          
                                                                                                    
// 1. Star Rating Valid Range (1 to 5 stars)                                                     
export type StarRating = 1 | 2 | 3 | 4 | 5;                                                      
                                                                                                    
// 2. Main Review Model Entity                                                                   
export interface Review {                                                                        
    id: string; // UUID                                                                          
    business_id: string; // Business na tumanggap ng review                                      
    reviewer_business_id?: string | null; // Business UUID ng nag-review (kung B2B endorsement)  
    name: string; // Pangalan ng reviewer o negosyo                                              
    rating: StarRating; // 1 hanggang 5                                                          
    comment: string; // Maximum 500 characters                                                   
    image_urls?: string[] | null; // Array ng hanggang 2 Cloudinary image URLs                   
    image_public_ids?: string[] | null; // Cloudinary asset IDs (ginagamit sa pagbura)           
    is_pinned: boolean; // True kung naka-pin sa pinakatuktok ng profile                         
    is_private: boolean; // True kung nakatago sa public feed (default sa B2B)                   
    pinned_at?: string | null; // ISO timestamp kung kailan na-pin                               
    created_at: string; // ISO timestamp                                                         
}                                                                                                
                                                                                                    
// 3. Payload para sa pagsumite ng Review (POST /v1/api/review/:id)                              
// Note: Ipinapadala ito bilang multipart/form-data kung may kalakip na litrato                  
export interface CreateReviewPayload {                                                           
    name: string;                                                                                
    rating: StarRating | number;                                                                 
    comment: string; // Max 500 chars                                                            
    device_id?: string; // Fingerprint ID para sa anti-spam cooldown tracking                    
    reviewer_business_id?: string; // Opsyonal: Business UUID para sa B2B review                 
    images?: (File | Blob)[]; // Maximum 2 images (max 5MB bawat isa)                            
}                                                                                                
                                                                                                    
// 4. Response mula sa POST /v1/api/review/:id                                                   
export interface CreateReviewResponse {                                                          
    success: true;                                                                               
    data: Review;                                                                                
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 5. Query Filters para sa Public Review Feed (GET /v1/api/review/:slug)                        
export interface ReviewListQuery {                                                               
    rating?: StarRating | number; // Filter ayon sa bituin (hal. ?rating=5)                      
    cursor?: string; // created_at ISO timestamp para sa cursor pagination                       
    limit?: number;  // Default: 10, Max: 50                                                     
}                                                                                                
                                                                                                    
// 6. Response mula sa Public Review Feed (GET /v1/api/review/:slug)                             
export interface ReviewListResponse {                                                            
    success: true;                                                                               
    business_id: string;                                                                         
    business_slug: string;                                                                       
    data: Review[]; // Naka-sort: Nauuna ang is_pinned: true, kasunod ang pinakabago             
    pagination: PaginationMeta;                                                                  
    message: string;                                                                             
}           