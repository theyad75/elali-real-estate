const ADMIN_TOKEN_STORAGE_KEY = "elali_admin_token";
const ADMIN_USERNAME_STORAGE_KEY = "elali_admin_username";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

export const getAdminUsername = () => localStorage.getItem(ADMIN_USERNAME_STORAGE_KEY);

export const setAdminSession = (token: string, username: string) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_USERNAME_STORAGE_KEY, username);
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_USERNAME_STORAGE_KEY);
};
