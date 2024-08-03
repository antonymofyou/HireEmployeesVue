import { configData } from "./configData.js";

export function isManager() {
  const managerDeviceName = localStorage.getItem(configData.MANAGER_DEVICE_NAME);
  const managerTokName = localStorage.getItem(configData.MANAGER_TOK_NAME);
  const managerTypeName = localStorage.getItem(configData.MANAGER_TYPE_NAME);

  const deviceIsCorrect = managerDeviceName !== null && managerDeviceName !== undefined && managerDeviceName !== '';
  const tokenIsCorrect = managerTokName !== null && managerTokName !== undefined && managerTokName !== '';
  const typeIsCorrect = managerTypeName !== null && managerTypeName !== undefined && managerTypeName !== '';

  return (deviceIsCorrect && tokenIsCorrect && typeIsCorrect) ? true : false;
}

export function isAdmin() {
  const managerTypeName = localStorage.getItem(configData.MANAGER_TYPE_NAME);

  return isManager() && managerTypeName === 'Админ';
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
      localStorage.removeItem(configData.MANAGER_TYPE_NAME);
      break;
    case "seeker":
      localStorage.removeItem(configData.SEEKER_TOK_NAME);
      localStorage.removeItem(configData.SEEKER_DEVICE_NAME);
      break;
  }
}