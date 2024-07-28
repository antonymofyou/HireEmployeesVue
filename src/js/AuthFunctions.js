import { configData } from "./configData.js";

export function isManager() {
  const managerDeviceName = localStorage.getItem(configData.MANAGER_DEVICE_NAME);
  const managerTokName = localStorage.getItem(configData.MANAGER_TOK_NAME);

  const deviceIsCorrect = managerDeviceName !== null && managerDeviceName !== undefined && managerDeviceName !== '';
  const tokenIsCorrect = managerTokName !== null && managerTokName !== undefined && managerTokName !== '';

  return (deviceIsCorrect && tokenIsCorrect) ? true : false;
}

export function isSeeker() {
  const seekerDeviceName = localStorage.getItem(configData.SEEKER_DEVICE_NAME);
  const seekerTokName = localStorage.getItem(configData.SEEKER_TOK_NAME);

  const deviceIsCorrect = seekerDeviceName !== null && seekerDeviceName !== undefined && seekerDeviceName !== '';
  const tokenIsCorrect = seekerTokName !== null && seekerTokName !== undefined && seekerTokName !== '';

  return (deviceIsCorrect && tokenIsCorrect) ? true : false;
}

export function logOut(whoIs) {
  // Метод разлогина пользователя
  switch (whoIs) {
    case "manager":
      localStorage.removeItem(configData.MANAGER_TOK_NAME);
      localStorage.removeItem(configData.MANAGER_DEVICE_NAME);
      break;
    case "seeker":
      localStorage.removeItem(configData.SEEKER_TOK_NAME);
      localStorage.removeItem(configData.SEEKER_DEVICE_NAME);
      break;
  }
}