import { useState, useEffect } from "react";                                                     
                                                                                                    
const DEVICE_ID_KEY = "feedback_device_id";                                                      
                                                                                                    
export const useDeviceId = (): string => {                                                       
    const [deviceId, setDeviceId] = useState<string>(() => {                                     
        if (typeof window === "undefined") return "";                                            
        return localStorage.getItem(DEVICE_ID_KEY) || "";                                        
    });                                                                                          
                                                                                                    
    useEffect(() => {                                                                            
        if (typeof window === "undefined") return;                                               
                                                                                                    
        let currentId = localStorage.getItem(DEVICE_ID_KEY);                                     
                                                                                                    
        // Kung unang beses pa lang at wala pang naka-save na ID, mag-generate ng bago           
        if (!currentId) {                                                                        
            currentId = "dev_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);                                                                                      
            localStorage.setItem(DEVICE_ID_KEY, currentId);                                      
        }                                                                                        
                                                                                                    
        setDeviceId(currentId);                                                                  
    }, []);                                                                                      
                                                                                                    
    return deviceId;                                                                             
};                                                                                               
                                                                                                    
export default useDeviceId;