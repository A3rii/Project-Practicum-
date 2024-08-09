import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./../../../../app/slice";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length >= 8 && confirmPassword === password) {
      setIsFormValid(true);

      const response = {
        name: name,
        email: email,
        phone_number: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
      };

      try {
        const action = await dispatch(registerUser(response));
        if (registerUser.fulfilled.match(action)) {
          const userRole = action.payload.role;
          if (userRole === "user") {
            navigate("/");
          }

          setEmail("");
          setPhoneNumber("");
          setPassword("");
          setConfirmPassword("");
          navigate("/");
        }
      } catch (e) {
        console.error("Error registering user:", e.messages);
      }

      console.log("User data:", response);

      setName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setIsFormValid(false);
      console.log("Please fill in the requirement");
    }
  };
  return (
    <>
      <div className="container signUp-container">
        <h2> Sign Up with your social account </h2>
        <button type="button" className="signUp-FaceBook">
          <i className="fa-brands fa-facebook"></i>
          <span> Continue with Facebook</span>
        </button>

        <button type="button" className="signUp-Gmail">
          <i className="fa-brands fa-google"></i>
          <span> Continue with Gmail</span>
        </button>
        <div className="signUp-withSocial">
          <span className="signUp-text">Register With Your Email</span>

          <div className="input-container">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              name="username"
              className="signUp-Username"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              name="email"
              className="signUp-Username"
            />
          </div>

          <div className="input-container">
            <input
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              name="phone number"
              className="signUp-Username"
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="signUp-Password"
            />
            <span>
              <i className="fa-solid fa-lock"></i>
            </span>
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="password"
              className="signUp-Password"
            />
            <span>
              <i className="fa-solid fa-lock"></i>
            </span>
          </div>

          <button
            onClick={handleSubmit}
            type="button"
            className="signUp-SignIn">
            {loading ? "Loading..." : "Continue"}
          </button>
          {isFormValid && (
            <p className="text-green-500 text-xs">
              Your login has been submitted
            </p>
          )}
          {isFormValid === false && (
            <p className="text-red-500 text-xs">
              Your login does not match requirement
            </p>
          )}
          {error && <div className="">{error}</div>}
          <div className="signUp-return">
            <Link to="/Login">
              <span className="signUp-toGuest"> Sign In page</span>
            </Link>
            <Link to="/">
              <span className="signUp-toGuest"> Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
