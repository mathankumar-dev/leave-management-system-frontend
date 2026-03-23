import { logout } from "@/services/auth/authStorage";
import { toast } from "sonner";

export const responseInterceptor = (error: any) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message || "Something went wrong";

  if (!error.response) {
    if (!error.config?.silent) {
      toast.error("Network Error", {
        description:
          "Please check your internet connection or try again later.",
      });
    }
  } else {
    switch (status) {
      case 400:
        if (!error.config?.silent?.includes(400))
          toast.warning("Invalid Request", { description: message });
        break;

      case 401:
        toast.error("Session Expired", {
          description: "Please log in again.",
        });
        logout();
        break;

      case 403:
        if (!error.config?.silent?.includes(403))
          toast.error("Access Denied", {
            description: "You don't have permission for this.",
          });
        break;

      case 404:
        if (!error.config?.silent?.includes(404))
          toast.info("Not Found", {
            description: "Resource doesn't exist.",
          });
        break;

      case 500:
        if (!error.config?.silent?.includes(500))
          toast.error("Server Error", {
            description: "Try again later.",
          });
        break;

      default:
        if (!error.config?.silent?.includes(status))
          toast.error("Error", { description: message });
    }
  }

  return Promise.reject(error);
};