"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { fetchUserByEmail, addUser } from "@/app/api/data";
import LoginForm from "@/app/ui/LoginForm";
import "./login.css";

function Login() {
  const router = useRouter();
  const { setCurrentUser } = useGlobal();
  const { showModal, closeModal } = useModal();

  async function handleSubmit(e) {
    e.preventDefault();
    const userEmail = e.target.userEmail.value.trim();
    const userPassword = e.target.userPassword.value;
    if (!userEmail || !userPassword) {
      showModal("Error", "E-mail and/or password missing");
      return;
    }
    try {
      const userInfoArray = await fetchUserByEmail(userEmail);
      const userInfo = userInfoArray[0];
      if (userInfo) {
        if (userInfo.password === userPassword) {
          setCurrentUser(userInfo);
          router.push("/bio");
        } else {
          showModal("Error", "Invalid password. Please try again.");
        }
      } else {
        showModal(
          "Create Account",
          "No account found. Would you like to create one?",
          () => handleNewAccount(userEmail, userPassword)
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      showModal("Error", "An error occurred while logging in.");
    }
  }

  async function handleNewAccount(email, password) {
    const newUser = {
      email: email,
      password: password,
      user_name: "New User",
      avatar: "/newUser.png",
      bio: "Enter your bio description here",
    };
    try {
      addUser(newUser);
      setCurrentUser(newUser);
      closeModal();
      router.push("/bio");
    } catch (error) {
      console.error("Error adding new user:", error);
      showModal("Error", "An error occurred while adding a new user.");
    }
  };

  return (
    <div id="login">
      <h1>Log In</h1>
      <div id="login-info" className="text-box">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
export default Login;
