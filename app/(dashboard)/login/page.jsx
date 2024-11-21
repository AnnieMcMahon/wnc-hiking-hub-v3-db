"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/api/authentication/auth";
import { fetchUserByEmail, addUser } from "@/app/api/data/data";
import LoginForm from "@/app/ui/LoginForm";
import "./login.css";

function Login() {
  const router = useRouter();
  const { setCurrentUser } = useGlobal();
  const { showModal, closeModal } = useModal();

  async function handleLogin(e) {
    e.preventDefault();
    const userEmail = e.target.email.value.trim();
    const userPassword = e.target.password.value;
    const userInfoArray = await fetchUserByEmail(userEmail);
    const userInfo = userInfoArray[0];
    if (userInfo) {
        const error = await login(userEmail, userPassword);
        if (error) {
          showModal("Error", "Invalid password. Please try again.");
        } else {
        setCurrentUser(userInfo);
        router.push("/bio");
      }
    } else {
      showModal(
        "Create Account",
        "No account found. Would you like to create one?",
        () => handleSignup(userEmail, userPassword)
      );
    }
  }

  async function handleSignup(email, password) {
    const error = await signup(email, password);
    if (error) {
      showModal("Error", "An error has occurred. Please try again.");
    } else {
      const user = await addUser(email);
      setCurrentUser(user[0]);
      closeModal();
      router.push("/bio");
    }
  }
  return (
    <div id="login">
      <h1>Log In</h1>
      <div id="login-info" className="text-box">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
export default Login;
