import { Link } from "react-router-dom"
export default function Login() {
   return (
      <>
         <div className="container login-container">
            <h2> Welcome to Sport Rental </h2>
            <Link to="/SignUp">
               <button type="button" className="login-Signup" >SIGN UP NOW </button>
            </Link>
            <div className="login-withSocial">
               <span className="login-text">Sign In with your social account</span>

               <button type="button" className="login-FaceBook" >
                  <i className="fa-brands fa-facebook"></i>
                  <span> Continue with Facebook</span>
               </button>

               <button type="button" className="login-Gmail" >
                  <i className="fa-brands fa-google"></i>
                  <span> Continue with Gmail</span>
               </button>

               <div className="input-container">
                  <input type="email"
                     placeholder="Username"
                     name="username"
                     className="login-Username" />
               </div>

               <div className="input-container">
                  <input
                     type="password"
                     placeholder="Password"
                     name="password"
                     className="login-Password" />
                  <span><i className="fa-solid fa-lock"></i></span>
               </div>

               <button type="button" className="login-SignIn" >Sign In</button>
               <div className="login-return">
                  <span> Forget Password</span>
                  <Link to="/" >
                     <span className="login-toGuest">Continue as a guest </span>
                  </Link>
               </div>
            </div>
         </div >
      </>
   )
}
