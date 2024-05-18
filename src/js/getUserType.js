import { configData } from "./configData.js";

export function getUserType(){
    if(localStorage.getItem(configData.MANAGER_DEVICE_NAME)) return "manager";
    else if(localStorage.getItem(configData.MANAGER_DEVICE_NAME)) return "seeker";
    else {
        return false;
    }
}