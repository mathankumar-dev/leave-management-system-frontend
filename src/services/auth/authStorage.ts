import Cookies from "js-cookie";

export const getToken = () => Cookies.get("lms_token");

export const setToken = (token: string) =>
  Cookies.set("lms_token", token, {
    secure: true,
    sameSite: "strict",
  });

export const clearToken = () => Cookies.remove("lms_token");

export const logout = () => {
  clearToken();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};