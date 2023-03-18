import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

declare var $: any;

export const successToast = (message: string, config: object = {}) => {
  return toast(message, { type: "success", ...config });
};
export const warning = (heading: string, message: string) => {
  $.toast({
    heading,
    text: message,
    showHideTransition: "slide",
    icon: "warning",
    loaderBg: "#57c7d4",
    position: "top-right",
  });
};
export const errorToast = (message: string, config: object = {}) => {
  return toast(message, { type: "error", ...config });
};
