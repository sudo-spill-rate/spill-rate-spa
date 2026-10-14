import { useContext } from "react";                                                              
import { ManageReviewContext } from "../context/manageReview/manageReviewContext";               
                                                                                                    
export const useManageReview = () => {                                                           
    const context = useContext(ManageReviewContext);                                             
                                                                                                    
    if (!context) {                                                                              
        throw new Error("useManageReview must be used within a ManageReviewProvider");           
    }                                                                                            
                                                                                                    
    return {                                                                                     
        isActionLoading: context.isActionLoading,                                                
        activeReviewId: context.activeReviewId,                                                  
        actionError: context.actionError,                                                        
        pinReview: context.pinReview,                                                            
        unpinReview: context.unpinReview,                                                        
        toggleVisibility: context.toggleVisibility,                                              
        deleteReview: context.deleteReview,
        postReply: context.postReply,
        deleteReply: context.deleteReply,
        fetchReports: context.fetchReports,
        updateReportStatus: context.updateReportStatus,                                                      
    };                                                                                           
};                                                                                               
                                                                                                    
export default useManageReview;  