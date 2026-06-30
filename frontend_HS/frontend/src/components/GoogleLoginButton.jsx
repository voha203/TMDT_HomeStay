import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification.jsx";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;

            if (!token) {
                Notification.error("Không lấy được Google token!");
                return;
            }

            const res = await axios.post("http://localhost:8080/api/users/google-login", {
                token: token,
            });

            localStorage.setItem("user", JSON.stringify(res.data));

            Notification.success("Đăng nhập Google thành công!");
            navigate("/");
        } catch (error) {
            console.error("Google login error:", error);
            Notification.error(error.response?.data || "Đăng nhập Google thất bại!");
        }
    };

    const handleGoogleError = () => {
        Notification.error("Đăng nhập Google thất bại!");
    };

    return (
        <div style={{ marginTop: "16px" }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="rectangular"
            />
        </div>
    );
};

export default GoogleLoginButton;