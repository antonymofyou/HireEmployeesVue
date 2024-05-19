import { configData } from "./configData.js";

export function isSeeker() {
  if (
    localStorage.getItem(configData.SEEKER_DEVICE_NAME) &&
    localStorage.getItem(configData.SEEKER_TOK_NAME)
  ) {
    return true;
  }
  return false;
}