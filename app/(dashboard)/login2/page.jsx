import { login, signup } from "./actions";
import "./login2.css";

export default function LoginPage() {
  return (
    <div id="login">
      <h1>Log In</h1>
      <div id="login-info" className="text-box">
        <form>
          <label htmlFor="email">Email: </label>
          <input id="email" name="email" type="email" autoComplete="on" required />
          <br />
          <label htmlFor="password">Password: </label>
          <input id="password" name="password" type="password" autoComplete="off" required />
          <br />
          <button formAction={login}>Log in</button>
          <button formAction={signup}>Sign up</button>
        </form>
      </div>
    </div>
  );
}
