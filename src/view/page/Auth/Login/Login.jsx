import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./../../../../app/slice";
import { useState } from "react";

export default function Login() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const { loading } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  //wheater user login with email or phone number
  const handleOnLogin = (e) => {
    e.preventDefault();
    let userCredentials = {
      emailOrPhone: credential,
      password,
    };

    /** Dispatch the action of login */
    dispatch(loginUser(userCredentials)).then((action) => {
      if (action.payload) {
        const userRole = action.payload.role;
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        setCredential("");
        setPassword("");
      }
    });
  };

  return (
    <>
      <div className="login-container">
        <h2> Welcome to Sport Rental </h2>

        <Link to="/signin-admin">
          <button type="button" className="login-Lessor">
            Lessor Sign In
          </button>
        </Link>

        <div className="login-withSocial">
          <span className="login-text">Sign In with your social account</span>

          <button type="button" className="login-FaceBook">
            <i className="fa-brands fa-facebook"></i>
            <span> Continue with Facebook</span>
          </button>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="login-Gmail">
            <i className="fa-brands fa-google"></i>
            <span> Continue with Gmail</span>
          </button>

          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="login-Username"
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              className="login-Password"
            />
            <span>
              <i className="fa-solid fa-lock"></i>
            </span>
          </div>

          <button
            onClick={handleOnLogin}
            type="button"
            className="login-SignIn">
            {loading ? "Loading..." : "Sign In"}
          </button>

          <div className="login-return">
            <Link to="/signup">
              <span className="login-toGuest"> Sign Up</span>
            </Link>
            <Link to="/">
              <span className="login-toGuest">Continue as a guest </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
