import { PaginationMeta } from './api';                                                          
                                                                                                    
// 1. Star Rating Distribution (Kinalkula ng backend mula sa reviews)                            
export interface RatingBreakdown {                                                               
    1: number; // Bilang ng 1-star reviews                                                       
    2: number; // Bilang ng 2-star reviews                                                       
    3: number; // Bilang ng 3-star reviews                                                       
    4: number; // Bilang ng 4-star reviews                                                       
    5: number; // Bilang ng 5-star reviews                                                       
}                                                                                                
                                                                                                    
// 2. Main Business Model Entity                                                                 
export interface Business {                                                                      
    id: string; // UUID                                                                          
    name: string;                                                                                
    description: string | null;                                                                  
    slug: string; // Halimbawa: "kape-balangay-00001"                                            
    image_url: string | null; // Cloudinary secure URL                                           
    image_public_id?: string | null; // Cloudinary asset ID                                      
    user_id?: string; // Owner User UUID                                                         
    created_at: string; // ISO timestamp                                                         
    category?: string | null; // e.g. "Food & Beverage", "Technology", "Retail"
    address?: string | null; // Physical address
    phone?: string | null; // Contact telephone or mobile number
    website?: string | null; // External website link
    is_verified?: boolean; // Verified Business Badge status
                                                                                                    
    // Aggregated rating statistics (Ibinabalik ng GET /businesses at GET /businesses/:slug)     
    total_reviews?: number;                                                                      
    average_rating?: number; // 0 to 5.0 (1 decimal place)                                       
    rating_breakdown?: RatingBreakdown;                                                          
}                                                                                                
                                                                                                    
// 3. Payload para sa paglikha ng Business (POST /v1/api/business)                               
// Note: Kung may image upload, ipinapadala ito bilang FormData                                  
export interface CreateBusinessPayload {                                                         
    name: string;                                                                                
    description?: string;                                                                        
    category?: string;                                                                           
    address?: string;                                                                            
    phone?: string;                                                                              
    website?: string;                                                                            
    image?: File | Blob | null; // Single business logo/cover image (max 5MB)                    
}                                                                                                
                                                                                                    
// 4. Response mula sa POST /v1/api/business                                                     
export interface CreateBusinessResponse {                                                        
    success: true;                                                                               
    data: Business;                                                                              
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 5. Response kapag umabot na sa 5-business quota (HTTP 403 Limit Error)                        
export interface BusinessQuotaLimitError {                                                       
    current_count: number;                                                                       
    max_limit: 5;                                                                                
}                                                                                                
                                                                                                    
// 6. Query Parameters para sa Business Directory (GET /v1/api/businesses)                       
export interface BusinessListQuery {                                                             
    cursor?: string; // created_at ISO string para sa pagination                                 
    limit?: number;  // Default: 10, Max: 50                                                     
    category?: string; // Filter by business category                                            
    search?: string;   // Filter by business name keyword                                        
    user_id?: string;  // Filter by owner user id
}                                                                                                
                                                                                                    
// 7. Response mula sa Business Directory (GET /v1/api/businesses)                               
export interface BusinessListResponse {                                                          
    success: true;                                                                               
    data: Business[];                                                                            
    pagination: PaginationMeta;                                                                  
}                                                                                                
                                                                                                    
// 8. Response mula sa Single Business Profile (GET /v1/api/businesses/:slug)                    
export interface BusinessDetailResponse {                                                        
    success: true;                                                                               
    data: Business;                                                                              
}