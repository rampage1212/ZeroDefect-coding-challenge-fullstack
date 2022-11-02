import { toast } from "react-toastify";
export function SuccessToast(toasttext) {
  toast.success(toasttext, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
export function ErrorToast(toasttext) {
  toast.error(toasttext, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    Transition: "flip",
  });
}
