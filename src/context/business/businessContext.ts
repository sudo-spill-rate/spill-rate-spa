import { createContext } from "react";                                                           
import { Business, CreateBusinessPayload } from "../../types/business";                          
import { PaginationMeta } from "../../types/api";                                                
                                                                                                    
export interface BusinessContextType {                                                           
    businesses: Business[];                                                                      
    selectedBusiness: Business | null;                                                           
    pagination: PaginationMeta | null;                                                           
    isLoading: boolean;                                                                          
    isLoadingMore: boolean;                                                                      
    isCreating: boolean;                                                                         
    error: string | null;                                                                        
                                                                                                    
    // Actions                                                                                   
    fetchBusinesses: (reset?: boolean, limit?: number) => Promise<void>;                         
    loadMoreBusinesses: () => Promise<void>;                                                     
    fetchBusinessBySlug: (slug: string) => Promise<Business | null>;                             
    createBusiness: (payload: CreateBusinessPayload) => Promise<{ success: boolean; data?: Business; message?: string }>;                                                                     
    clearSelectedBusiness: () => void;                                                           
}                                                                                                
                                                                                                    
export const BusinessContext = createContext<BusinessContextType | undefined>(undefined);