import { Link } from "react-router-dom"
export default function SignUp() {
   return (
      <>
         <>
            <div className="container signUp-container">
               <h2> Sign Up with your social account </h2>
               <button type="button" className="signUp-FaceBook" >
                  <i className="fa-brands fa-facebook"></i>
                  <span> Continue with Facebook</span>
               </button>

               <button type="button" className="signUp-Gmail" >
                  <i className="fa-brands fa-google"></i>
                  <span> Continue with Gmail</span>
               </button>
               <div className="signUp-withSocial">
                  <span className="signUp-text">Register With Your Email</span>



                  <div className="input-container">
                     <input type="email"
                        placeholder="Username"
                        name="username"
                        className="signUp-Username" />
                  </div>

                  <div className="input-container">
                     <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        className="signUp-Password" />
                     <span><i className="fa-solid fa-lock"></i></span>
                  </div>

                  <div className="input-container">
                     <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password"
                        className="signUp-Password" />
                     <span><i className="fa-solid fa-lock"></i></span>
                  </div>

                  <button type="button" className="signUp-SignIn" >Continue</button>
                  <div className="signUp-return">
                     <Link to="/Login">
                        <span className="signUp-toGuest">  Sign In page</span>
                     </Link>
                     <Link to="/">
                        <span className="signUp-toGuest"> Home</span>
                     </Link>

                  </div>
               </div>
            </div>
         </>
      </>
   )
}
