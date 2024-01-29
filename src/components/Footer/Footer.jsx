export default function Footer() {
   return (
      <footer className="footer-container">

         <div className="footer-wrapper">

            <div className="footer-title">
               <h2 className="footer-text">Sport  <span>Rental </span></h2>
               <div className="footer-socialmedia">
                  <i className="fa-brands fa-facebook"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-telegram"></i>
                  <i className="fa-brands fa-facebook-messenger"></i>
               </div>
            </div>

            <div className="footer-contact">
               <h2 className="footer-text">Contact </h2>

               <div className="footer-information">
                  <div className="footer-address">
                     <i className="fa-solid fa-map-location-dot"></i>
                     <span> St 168, sangkat psar tmey 3, khan daun penh, Phnom Penh</span>
                  </div>
                  <div className="footer-phone">
                     <i className="fa-solid fa-phone"></i>
                     <span>(+885) 23-880-880</span>
                  </div>
                  <div className="footer-email">
                     <i className="fa-regular fa-envelope"></i>
                     <span>SportRental168@yahoo.com</span>
                  </div>
               </div>

            </div>


            <div className="footer-about">
               <h2 className="footer-text">About </h2>
               <a href=""> Contact</a>
               <a href="#"> Support Center</a>
               <a href="#"> Privacy Policy</a>
               <a href="#"> Terms & Condition </a>
            </div>

            <div className="footer-comment">
               <h2 className="footer-text">Comments </h2>
               <input className="footer-inputEmail" type="text" placeholder="Your Email..." />
               <input className="footer-inputFeed" type="text" placeholder="Feed back Here..." />
            </div>
         </div>

         <div className="footer-copyright">
            <h3> © All Rights Reserved by<span> Sport Rental</span> </h3>
         </div>
      </footer>
   );
}
