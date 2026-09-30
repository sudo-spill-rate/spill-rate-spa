// 1. Authenticated User Profile (Ibinabalik ng GET /v1/api/auth/me)                             
export interface AuthUser {                                                                      
    id: string; // Supabase Auth User UUID                                                       
    email: string;                                                                               
    name: string; // Full name mula sa Google account                                            
    avatar_url: string | null; // Profile picture mula sa Google                                 
    provider: string; // 'google'                                                                
}                                                                                                
                                                                                                    
// 2. Response mula sa GET /v1/api/auth/me                                                       
export interface GetMeResponse {                                                                 
    success: true;                                                                               
    user: AuthUser;                                                                              
}                                                                                                
                                                                                                    
// 3. Response mula sa GET /v1/api/auth/google                                                   
export interface GoogleAuthUrlResponse {                                                         
    success: true;                                                                               
    url: string; // Google OAuth consent URL na pupuntahan ng user                               
    message: string;                                                                             
}                                                                                                
                                                                                                    
// 4. Query parameters kapag humihingi ng Google Auth URL                                        
export interface GoogleAuthUrlQuery {                                                            
    redirect_to?: string; // Callback URL sa frontend pagkatapos mag-sign in                     
    redirect?: boolean | 'true' | 'false'; // Kung gusto mong i-auto redirect ng server          
}                                                                                                
                                                                                                    
// 5. Client Session State (Ginagamit sa State Management tulad ng Zustand, Redux, o Context API)
export interface AuthSession {                                                                   
    user: AuthUser | null;                                                                       
    token: string | null; // Bearer JWT token mula sa Supabase                                   
    isAuthenticated: boolean;                                                                    
    isLoading: boolean;                                                                          
}         