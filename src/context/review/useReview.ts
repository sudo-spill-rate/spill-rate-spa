import { useContext } from "react";                                                              
import { ReviewContext, ReviewContextType } from "./reviewContext";                              
                                                                                                    
export const useReview = (): ReviewContextType => {                                              
    const context = useContext(ReviewContext);                                                   
    if (!context) {                                                                              
        throw new Error("useReview must be used within a ReviewProvider");                       
    }                                                                                            
    return context;                                                                              
};                                                                                               
                                                                                                    
export default useReview;