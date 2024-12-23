"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { login, signup, resetPassword } from "@/app/api/authentication/auth";
import { fetchUserByEmail, addUser } from "@/app/api/data/data";
import LoginForm from "@/app/ui/forms/LoginForm";
import "./login.css";

function Login() {
  const router = useRouter();
  const { setCurrentUser } = useGlobal();
  const { showModal, closeModal } = useModal();

  async function handleLogin(newLogin) {
    if (newLogin) {
      const userInfoArray = await fetchUserByEmail(newLogin.email);
      const userInfo = userInfoArray[0];
      if (userInfo) {
        try {
          await login(newLogin);
          setCurrentUser(userInfo);
          router.push("/bio");
        } catch (error) {
          showModal("Error", "Invalid password. Please try again.");
        }
      } else {
        showModal(
          "Create Account",
          "No account found. Would you like to create one?",
          () => handleSignup(newLogin)
        );
      }
    }
  }

  async function handleSignup(loginInfo) {
    try {
      await signup(loginInfo);
      const user = await addUser(loginInfo.email);
      setCurrentUser(user[0]);
      closeModal();
      router.push("/edit-bio");
    } catch (error) {
      showModal("Error", "An error has occurred. Please try again.");
    }
  }

  async function handlePasswordReset(email) {
    try {
      await fetchUserByEmail(email);
      try {
        await resetPassword(email, `${window.location.origin}/reset-password`);
        showModal(
          "Success",
          "Please follow the link in your e-mail to reset your password."
        );
      } catch (error) {
        showModal("Error", "Error sending reset e-mail.");
      }
    } catch (error) {
      showModal("Error", "Please enter a valid e-mail address.");
    }
  }

  return (
    <div id="login">
      <h1>Log In</h1>
      <div id="login-info" className="text-box">
        <LoginForm onSubmit={handleLogin} onClick={handlePasswordReset} />
      </div>
    </div>
  );
}
export default Login;
