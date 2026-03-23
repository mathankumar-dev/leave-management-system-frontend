import Cookies from "js-cookie";

export const getToken = () => Cookies.get("lms_token");

export const clearToken = () => Cookies.remove("lms_token");

export const logout = () => {
  clearToken();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};