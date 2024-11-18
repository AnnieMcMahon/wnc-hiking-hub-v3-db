import Form from "next/form"

export default function LoginForm({ onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <label htmlFor="email">E-mail: </label>
      <input type="email" name="email" id="email" autoComplete="on" />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        id="password"
        autoComplete="off"
      />
      <br />
      <button type="submit" className="form-button">
        Log In
      </button>
    </Form>
  );
}
