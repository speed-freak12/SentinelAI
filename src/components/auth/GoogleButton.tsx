import { useGoogleLogin } from "@react-oauth/google";
import API from "@/services/authService";

interface Props {
  onSuccess: () => void;
}

export default function GoogleButton({ onSuccess }: Props) {
  const login = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await API.post("/google-login", {
          token: tokenResponse.access_token,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onSuccess();
      } catch (err) {
        console.error("Google Login Error:", err);
      }
    },

    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition hover:bg-white/10"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="h-5 w-5"
      />
      Continue with Google
    </button>
  );
}