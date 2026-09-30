                                                                                                                                                                                              
// 1. Generic API Response (Tumatanggap ng success: true o success: false)                       
export interface ApiResponse<T = any> {                                                          
    success: boolean;                                                                            
    data: T;                                                                                     
    message?: string;                                                                            
}                                                                                                
                                                                                                    
// 2. Action Response na walang ibinabalik na data (hal. DELETE, unpin, logout)                  
export interface ApiActionResponse {                                                             
    success: boolean;                                                                            
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 3. Generic Error Response mula sa Express Error Handlers at Middlewares                       
export interface ApiErrorResponse<T = any> {                                                     
    success: false;                                                                              
    message: string;                                                                             
    data?: T; // Halimbawa: cooldown details sa HTTP 429                                         
}                                                                                                
                                                                                                    
// 4. Cursor Pagination Metadata mula sa models natin (getAllBusiness & getReviews)              
export interface PaginationMeta {                                                                
    limit: number;                                                                               
    has_more: boolean;                                                                           
    next_cursor: string | null; // ISO timestamp string ng huling item (created_at)              
}                                                                                                
                                                                                                    
// 5. Paginated Response Wrapper para sa mga listahan (hal. /businesses at /review/:slug)        
export interface PaginatedApiResponse<T> {                                                       
    success: boolean;                                                                            
    data: T[];                                                                                   
    pagination: PaginationMeta;                                                                  
    message?: string;                                                                            
}                                                                                                
                                                                                                    
// 6. Base Query Parameters para sa Cursor-based Pagination                                      
export interface CursorPaginationParams {                                                        
    cursor?: string;                                                                             
    limit?: number; // Default: 10, Max: 50 sa backend                                           
}                                                                                                
                                                                                                    
// 7. Type-guard Helper para sa client                                                           
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse; 