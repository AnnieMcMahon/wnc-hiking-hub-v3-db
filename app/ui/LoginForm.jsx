export default function LoginForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
          <label htmlFor="userEmail">E-mail: </label>
          <input type="email" name="email" id="userEmail" autoComplete="true" />
          <br />
          <label htmlFor="userPassword">Password: </label>
          <input
            type="password"
            name="password"
            id="userPassword"
            autoComplete="false"
          />
          <br />
          <button type="submit" className="form-button">
            Log In
          </button>
        </form>
  );
};