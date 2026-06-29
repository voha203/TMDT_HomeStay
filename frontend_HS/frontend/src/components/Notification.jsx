import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
    position: "top-right",
    autoClose: 2500,
    theme: "colored",
};

const Notification = {
    success: (message) => toast.success(message, toastConfig),
    error: (message) => toast.error(message, toastConfig),
    warning: (message) => toast.warning(message, toastConfig),
    info: (message) => toast.info(message, toastConfig),
};

export default Notification;