import {jwtDecode} from "jwt-decode";
export const getUserId = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.id || null; // Use the numeric id
};


export const storeToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.roles?.[0] || null;
};

export const logout = () => {
  localStorage.removeItem("token");
};
