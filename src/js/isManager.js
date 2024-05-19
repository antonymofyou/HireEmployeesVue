import { configData } from "./configData.js";

export function isManager() {
  if (
    localStorage.getItem(configData.MANAGER_DEVICE_NAME) &&
    localStorage.getItem(configData.MANAGER_TOK_NAME)
  ) {
    return true;
  }
  return false;
}