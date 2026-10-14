/**                                                                                              
 * eligibility.ts                                                                                
 * Type definitions para sa Review Eligibility, Device Fingerprinting, at Anti-Spam              
 */                                                                                              
                                                                                                    
// 1. Mga Posibleng Dahilan kapag Naka-Cooldown o Na-Block ang Client                            
export type CooldownReason =                                                                     
    | 'device_cooldown'       // Nakapag-review na ang device na ito sa nakalipas na 24 oras     
    | 'network_limit_reached'  // Umabot na sa 5 reviews ang limit ng Wi-Fi / IP network ngayong araw                                                                                               
    | 'ip_cooldown';          // IP cooldown fallback kapag walang ipinasang device_id           
                                                                                                    
// 2. Simplified Business Reference na kasama sa eligibility response                            
export interface EligibilityBusinessRef {                                                        
    id: string;   // Business UUID                                                               
    name: string; // Business Name                                                               
    slug: string; // Business Slug                                                               
}                                                                                                
                                                                                                    
// 3. Query Parameters kapag nagche-check ng eligibility (GET /v1/api/review/:slug/eligibility)  
export interface CheckEligibilityQuery {                                                         
    device_id?: string; // Client device fingerprint (hal. mula sa FingerprintJS o localStorage) 
}                                                                                                
                                                                                                    
// 4. Response mula sa GET /v1/api/review/:slug/eligibility                                      
export interface CheckEligibilityResponse {                                                      
    success: true;                                                                               
    canReview?: boolean; // True kung puwedeng mag-iwan ng review (mula sa backend spec)
    remainingHours?: number; // 0 kung puwede mag-review; > 0 kung naka-cooldown
    eligible?: boolean; // Fallback compatibility alias
    cooldown_remaining_hours?: number; // Fallback compatibility alias
    business: EligibilityBusinessRef;                                                            
    message?: string;                                                                             
}                                                                                                
                                                                                                    
// 5. Data payload sa loob ng HTTP 429 Error kapag sinubukang mag-submit habang naka-cooldown    
export interface RateLimitCooldownData {                                                         
    cooldown_remaining_hours: number;                                                            
    reason: CooldownReason;                                                                      
}          