import React, {                                                                                                    
    useState,                                                                                                      
    ReactNode,                                                                                                     
    useCallback,                                                                                                   
} from "react";                                                                                                    
import { ReviewContext } from "./reviewContext";                                                                   
import { Review, CreateReviewPayload, ReviewListQuery } from "../../types/review";                                 
import { CheckEligibilityResponse } from "../../types/eligibility";                                                
import { PaginationMeta } from "../../types/api";                                                                  
import { reviewService } from "../../services/reviewService";                                                      
                                                                                                                    
interface ReviewProviderProps {                                                                                    
    children: ReactNode;                                                                                           
}                                                                                                                  
                                                                                                                    
export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {                                   
    const [reviews, setReviews] = useState<Review[]>([]);                                                          
    const [eligibility, setEligibility] = useState<CheckEligibilityResponse | null>(null);                         
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);                                     
    const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);                                      
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);                                            
    const [isCheckingEligibility, setIsCheckingEligibility] = useState<boolean>(false);                            
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);                                              
    const [error, setError] = useState<string | null>(null);                                                       
                                                                                                                    
    // Pre-flight Eligibility Check gamit ang reviewService                                                        
    const checkEligibility = useCallback(async (                                                                   
        businessSlug: string,                                                                                      
        deviceId?: string                                                                                          
    ): Promise<CheckEligibilityResponse | null> => {                                                               
        try {                                                                                                      
            setIsCheckingEligibility(true);                                                                        
            setError(null);                                                                                        
                                                                                                                    
            const res = await reviewService.checkEligibility(businessSlug, deviceId);                              
                                                                                                                    
            if (res.success && res.data) {                                                                         
                setEligibility(res.data);                                                                          
                return res.data;                                                                                   
            }                                                                                                      
                                                                                                                    
            return null;                                                                                           
        } catch (err: any) {                                                                                       
            setError(err?.message || "Failed to check eligibility.");                                              
            return null;                                                                                           
        } finally {                                                                                                
            setIsCheckingEligibility(false);                                                                       
        }                                                                                                          
    }, []);                                                                                                        
                                                                                                                    
    // Kumuha ng public reviews gamit ang reviewService                                                            
    const fetchReviews = useCallback(async (                                                                       
        businessSlug: string,                                                                                      
        query?: ReviewListQuery                                                                                    
    ): Promise<void> => {                                                                                          
        try {                                                                                                      
            setIsLoadingReviews(true);                                                                             
            setError(null);                                                                                        
                                                                                                                    
            const res = await reviewService.getReviews(businessSlug, query);                                       
                                                                                                                    
            if (res.success) {                                                                                     
                setReviews(res.data);                                                                              
                setPagination(res.pagination);                                                                     
            } else {                                                                                               
                setError(res.message || "Failed to load reviews.");                                                
            }                                                                                                      
        } catch (err: any) {                                                                                       
            setError(err?.message || "Failed to load reviews.");                                                   
        } finally {                                                                                                
            setIsLoadingReviews(false);                                                                            
        }                                                                                                          
    }, []);                                                                                                        
                                                                                                                    
    // Load more reviews gamit ang cursor                                                                          
    const loadMoreReviews = useCallback(async (businessSlug: string, ratingFilter?: number): Promise<void> => {                
        if (!pagination?.has_more || !pagination?.next_cursor || isLoadingMore) return;                            
                                                                                                                    
        try {                                                                                                      
            setIsLoadingMore(true);                                                                                
                                                                                                                    
            const res = await reviewService.getReviews(businessSlug, {                                             
                cursor: pagination.next_cursor,                                                                    
                limit: pagination.limit || 10,                                                                     
                rating: ratingFilter,                                                                              
            });                                                                                                    
                                                                                                                    
            if (res.success) {                                                                                     
                setReviews((prev) => [...prev, ...res.data]);                                                      
                setPagination(res.pagination);                                                                     
            }                                                                                                      
        } catch (err: any) {                                                                                       
            console.error("Load more reviews error:", err);                                                        
        } finally {                                                                                                
            setIsLoadingMore(false);                                                                               
        }                                                                                                          
    }, [pagination, isLoadingMore]);                                                                                                             
                                                                                                                    
    // Mag-submit ng review gamit ang reviewService                                                                
    const submitReview = useCallback(async (                                                                                   
        businessSlug: string,                                                                                      
        payload: CreateReviewPayload                                                                               
    ): Promise<{ success: boolean; data?: Review; message?: string }> => {                                         
        try {                                                                                                      
            setIsSubmitting(true);                                                                                 
            setError(null);                                                                                        
                                                                                                                    
            const res = await reviewService.submitReview(businessSlug, payload);                                   
                                                                                                                    
            if (res.success && res.data) {                                                                         
                const newReview = res.data;                                                                        
                                                                                                                    
                // Kung public review, i-display kaagad                                                            
                if (!newReview.is_private) {                                                                       
                    setReviews((prev) => [newReview, ...prev]);                                                    
                }                                                                                                  
                                                                                                                    
                // I-update ang cooldown state                                                                     
                if (eligibility) {                                                                                 
                    setEligibility({                                                                               
                        ...eligibility,                                                                            
                        canReview: false,
                        remainingHours: 24,
                        eligible: false,                                                                           
                        cooldown_remaining_hours: 24,                                                              
                    });                                                                                            
                }                                                                                                  
                                                                                                                    
                return {                                                                                           
                    success: true,                                                                                 
                    data: newReview,                                                                               
                    message: res.message || "Review submitted successfully!",                                      
                };                                                                                                 
            }                                                                                                      
                                                                                                                    
            setError(res.message || "Failed to submit review.");                                                   
            return {                                                                                               
                success: false,                                                                                    
                message: res.message || "Failed to submit review.",                                                
            };                                                                                                     
        } catch (err: any) {                                                                                       
            const message = err?.message || "Failed to submit review.";                                            
            setError(message);                                                                                     
            return { success: false, message };                                                                    
        } finally {                                                                                                
            setIsSubmitting(false);                                                                                
        }                                                                                                          
    }, [eligibility]);                                                                                                             

    // Toggle Helpful Vote
    const toggleHelpfulVote = useCallback(async (
        reviewId: string
    ): Promise<{ success: boolean; data?: { voted: boolean; helpful_count: number }; message?: string }> => {
        try {
            const res = await reviewService.toggleHelpfulVote(reviewId);
            if (res.success && res.data) {
                const updatedData = res.data;
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === reviewId ? { ...r, helpful_count: updatedData.helpful_count } : r
                    )
                );
                return {
                    success: true,
                    data: updatedData,
                    message: res.message,
                };
            }
            return { success: false, message: res.message || "Failed to update vote." };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to update vote." };
        }
    }, []);

    // Report a Review
    const reportReview = useCallback(async (
        reviewId: string,
        payload: { reason: any; details?: string }
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const res = await reviewService.reportReview(reviewId, payload);
            return {
                success: res.success,
                message: res.message || (res.success ? "Review reported successfully." : "Failed to report review."),
            };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to report review." };
        }
    }, []);
                                                                                                                    
    const clearReviews = useCallback((): void => {                                                                             
        setReviews([]);                                                                                            
        setPagination(null);                                                                                       
        setEligibility(null);                                                                                      
    }, []);                                                                                                             
                                                                                                                    
    return (                                                                                                       
        <ReviewContext.Provider                                                                                    
            value={{                                                                                               
                reviews,                                                                                           
                eligibility,                                                                                       
                pagination,                                                                                        
                isLoadingReviews,                                                                                  
                isLoadingMore,                                                                                     
                isCheckingEligibility,                                                                             
                isSubmitting,                                                                                      
                error,                                                                                             
                checkEligibility,                                                                                  
                fetchReviews,                                                                                      
                loadMoreReviews,                                                                                   
                submitReview,
                toggleHelpfulVote,
                reportReview,                                                                                      
                clearReviews,                                                                                      
            }}                                                                                                     
        >                                                                                                          
            {children}                                                                                             
        </ReviewContext.Provider>                                                                                  
    );                                                                                                             
};                                                                                                                 
                                                                                                                    
export default ReviewProvider;