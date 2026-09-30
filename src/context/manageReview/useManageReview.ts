import { useContext } from "react";                                                              
import { ManageReviewContext, ManageReviewContextType } from "./manageReviewContext";            
                                                                                                    
export const useManageReview = (): ManageReviewContextType => {                                  
    const context = useContext(ManageReviewContext);                                             
    if (!context) {                                                                              
        throw new Error("useManageReview must be used within a ManageReviewProvider");           
    }                                                                                            
    return context;                                                                              
};                                                                                               
                                                                                                    
export default useManageReview;