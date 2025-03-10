import { useModal } from "@/app/context/ModalContext";
import { useState } from "react";
import { validatePassword } from "@/app/lib/utils";

export default function LoginForm({ onSubmit = () => {}, onClick = () => {}  }) {
  const { showModal } = useModal();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLogin = Object.fromEntries(formData.entries());
    const password = newLogin.password;
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      showModal("Error", errorMsg);
    } else {
      onSubmit(newLogin);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (email.length > 0) {
      onClick(email);
    } else {
      showModal("Error", "Please enter your e-mail.");
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">E-mail: </label>
      <input type="email" name="email" id="email" className="w-80" autoComplete="on" required onChange={handleEmailChange} />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        id="password"
        autoComplete="off"
        required
      />
      <br/>
      <a href="#" className="ml-2 text-green-800 hover:text-green-600 text-sm" onClick={handleClick}>Forgot password?</a>
      <br />
      <p className="my-4">Password must be at least six characters and must contain at least one uppercase letter, one number, and one special character</p>
      <button type="submit" className="form-button">
        Submit
      </button>
    </form>
  );
}
