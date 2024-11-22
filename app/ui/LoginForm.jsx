import { useModal } from "@/app/context/ModalContext";

export default function LoginForm({ onSubmit = () => {} }) {
  const { showModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    if (password.length < 6) {
      showModal("Error", "Password must be at least 6 characters.");
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">E-mail: </label>
      <input type="email" name="email" id="email" autoComplete="on" required />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        id="password"
        autoComplete="off"
        required
      />
      <br />
      <button type="submit" className="form-button">
        Log In
      </button>
    </form>
  );
}
