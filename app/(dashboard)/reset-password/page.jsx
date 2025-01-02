"use client";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { updatePassword } from "@/app/api/authentication/auth";
import { validatePassword } from "@/app/lib/utils";
import "./reset-password.css";

function ResetPassword() {
  const { showModal, closeModal } = useModal();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      showModal("Error", errorMsg);
    } else {
      try {
        await updatePassword(password);
        showModal("Success", "Your password has been updated.", null, () => {
          closeModal();
        });
        router.push("/login");
      } catch (error) {
        showModal("Error", error.message || "An error has occurred.");
      }
    }
  }

  return (
    <div id="reset-pw">
      <h1>Reset Password</h1>
      <div id="login-info" className="text-box">
        <form role="form" onSubmit={handleSubmit}>
          <label htmlFor="password">New Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            required
          />
          <br />
          <p>
            Password must be at least six characters and must contain at least
            one uppercase letter, one number, and one special character
          </p>
          <button type="submit" className="form-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
export default ResetPassword;
