"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, signup, resetPassword } from "@/app/api/authentication/auth";
import { fetchUserByEmail, addUser } from "@/app/api/data/data";
import LoginForm from "@/app/ui/forms/LoginForm";
import Disclosure from "@/app/ui/components/Disclosure";
import "./login.css";

function Login() {
  const router = useRouter();
  const { setCurrentUser } = useGlobal();
  const { showModal, closeModal } = useModal();
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [loginInfo, setLoginInfo] = useState({});

  async function handleLogin(newLogin) {
    if (newLogin) {
      setLoginInfo(newLogin);
      const userInfoArray = await fetchUserByEmail(newLogin.email);
      const userInfo = userInfoArray[0];
      if (userInfo) {
        try {
          await login(newLogin);
          setCurrentUser(userInfo);
          router.push(`/bio/${userInfo.id}`);
        } catch (error) {
          showModal("Error", "Invalid password. Please try again.");
        }
      } else {
        showModal(
          "Create Account",
          "No account found. Would you like to create one?",
          () => { 
            setShowDisclosure(true);
            closeModal();
          }
        );
      }
    }
  }

  async function handleSignup() {
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
      <h1>Log In / Sign Up</h1>
      <div id="login-info" className="text-box">
        <LoginForm onSubmit={handleLogin} onClick={handlePasswordReset} />
        {showDisclosure && (
        <>
          <Disclosure />
          <button onClick={handleSignup}>I agree</button>
        </>
      )}
      </div>
    </div>
  );
}
export default Login;
