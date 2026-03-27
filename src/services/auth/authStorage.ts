
import Cookies from "js-cookie";

export const getToken = () => Cookies.get("lms_token");

export const setToken = ( id: string , token?: string,) => {
  // Cookies.set("lms_token", token, {
  //   secure: true,
  //   sameSite: "Lax",
  //   expires: 1,
  //   path: "/",
  // });
  Cookies.set("lms_user_id", id);
}

export const clearToken = () => {
  Cookies.remove("lms_token");
  Cookies.remove("lms_user_id");
};

export const logout = () => {
  clearToken();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};