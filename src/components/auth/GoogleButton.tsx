import { GoogleLogin } from "@react-oauth/google";
import API from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onSuccess: () => void;
}

export default function GoogleButton({ onSuccess }: Props) {
  const { login } = useAuth();

  return (
    <div className="mt-4 flex justify-center">
      <GoogleLogin
        theme="filled_black"
        shape="pill"
        size="large"
        width="340"
        text="continue_with"
        onSuccess={async (credentialResponse) => {
          try {
            const { data } = await API.post("/auth/google-login", {
              token: credentialResponse.credential,
            });

            login(data.user, data.token);

            onSuccess();
          } catch (err) {
            console.error("Google Login Error:", err);
          }
        }}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </div>
  );
}