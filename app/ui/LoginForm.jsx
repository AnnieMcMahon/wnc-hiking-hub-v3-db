import Form from "next/form"

export default function LoginForm({ onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <label htmlFor="email">E-mail: </label>
      <input type="email" name="email" id="email"  required />
      <br />
      <label htmlFor="password">Password (6 characters minimum): </label>
      <input
        type="password"
        name="password"
        id="password"
        autoComplete="off"
        minLength="6"
        required
      />
      <br />
      <button type="submit" className="form-button">
        Log In
      </button>
    </Form>
  );
}
