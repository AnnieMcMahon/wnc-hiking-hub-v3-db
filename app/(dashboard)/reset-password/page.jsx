"use client";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/api/authentication/auth";
import { validatePassword } from "@/app/lib/utils";
import "./reset-password.css";

function ResetPassword() {
  const { showModal, closeModal } = useModal();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      showModal("Error", errorMsg);
    } else {
      const updatePwResult = await updatePassword(password);
      console.log("UpdatePwResult: ", updatePwResult);
      showModal("Success", "Your password has been updated.", null, () => {
        closeModal();
      });
      router.push("/login");
    }
  }

  return (
    <div id="reset-pw">
      <h1>Reset Password</h1>
      <div id="login-info" className="text-box">
        <form onSubmit={handleSubmit}>
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
};
export default ResetPassword;
