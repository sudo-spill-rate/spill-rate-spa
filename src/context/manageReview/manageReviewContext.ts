import { createContext } from "react";                                                           
import { Review } from "../../types/review";                                                     
                                                                                                    
export interface ManageReviewContextType {                                                       
    isActionLoading: boolean;                                                                    
    activeReviewId: string | null;                                                               
    actionError: string | null;                                                                  
                                                                                                    
    // Actions para sa Business Owner                                                            
    pinReview: (reviewId: string) => Promise<{ success: boolean; data?: Review; message?: string }>;                                                                                                
    unpinReview: (reviewId: string) => Promise<{ success: boolean; data?: Review; message?: string }>;                                                                                         
    toggleVisibility: (reviewId: string, is_private: boolean) => Promise<{ success: boolean; data?: Review; message?: string }>;                                                                
    deleteReview: (reviewId: string) => Promise<{ success: boolean; message?: string }>;         
}                                                                                                
                                                                                                    
export const ManageReviewContext = createContext<ManageReviewContextType | undefined>(undefined);