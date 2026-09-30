import { createContext } from "react";                                                           
import { Review, CreateReviewPayload, ReviewListQuery } from "../../types/review";               
import { CheckEligibilityResponse } from "../../types/eligibility";                              
import { PaginationMeta } from "../../types/api";                                                
                                                                                                    
export interface ReviewContextType {                                                             
    reviews: Review[];                                                                           
    eligibility: CheckEligibilityResponse | null;                                                
    pagination: PaginationMeta | null;                                                           
    isLoadingReviews: boolean;                                                                   
    isLoadingMore: boolean;                                                                      
    isCheckingEligibility: boolean;                                                              
    isSubmitting: boolean;                                                                       
    error: string | null;                                                                        
                                                                                                    
    // Actions                                                                                   
    checkEligibility: (businessSlug: string, deviceId?: string) => Promise<CheckEligibilityResponse | null>;                                                          
    fetchReviews: (businessSlug: string, query?: ReviewListQuery) => Promise<void>;              
    loadMoreReviews: (businessSlug: string, ratingFilter?: number) => Promise<void>;             
    submitReview: (businessSlug: string, payload: CreateReviewPayload) => Promise<{ success: boolean; data?: Review; message?: string }>;                                                       
    clearReviews: () => void;                                                                    
}                                                                                                
                                                                                                    
export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);