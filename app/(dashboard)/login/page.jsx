"use client"
import { useGlobal } from "@/app/context/GlobalContext"
import { useModal } from "@/app/context/ModalContext"
import { useRouter } from "next/navigation"
import { fetchUserByEmail, addUser } from "@/app/api/data"
import LoginForm from "@/app/ui/LoginForm"
import { DEFAULT_AVATAR, DEFAULT_USER_NAME, DEFAULT_BIO } from "@/app/lib/constants"
import "./login.css"

function Login() {
  const router = useRouter()
  const { setCurrentUser } = useGlobal()
  const { showModal, closeModal } = useModal()

  async function handleLogin(e) {
    e.preventDefault()
    const userEmail = e.target.email.value.trim()
    const userPassword = e.target.password.value
    if (!userEmail || !userPassword) {
      showModal("Error", "E-mail and/or password missing")
      return
    }
    try {
      const userInfoArray = await fetchUserByEmail(userEmail)
      const userInfo = userInfoArray[0]
      if (userInfo) {
        if (userInfo.password === userPassword) {
          setCurrentUser(userInfo)
          router.push("/bio")
        } else {
          showModal("Error", "Invalid password. Please try again.")
        }
      } else {
        showModal(
          "Create Account",
          "No account found. Would you like to create one?",
          () => handleSignup(userEmail, userPassword)
        )
      }
    } catch (error) {
      console.error("Error during login:", error)
      showModal("Error", "An error occurred while logging in.")
    }
  }

  async function handleSignup(email, password) {
    const newUser = {
      email: email,
      password: password,
      user_name: DEFAULT_USER_NAME,
      avatar: DEFAULT_AVATAR,
      bio: DEFAULT_BIO,
    }
    try {
      const user = await addUser(newUser)
      setCurrentUser(user[0])
      closeModal()
      router.push("/bio")
    } catch (error) {
      console.error("Error adding new user:", error)
      showModal("Error", "An error occurred while adding a new user.")
    }
  }
  return (
    <div id="login">
      <h1>Log In</h1>
      <div id="login-info" className="text-box">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  )
}
export default Login
