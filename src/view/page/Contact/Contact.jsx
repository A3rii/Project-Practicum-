import Header from "../../../components/Header/Header"
import Footer from "./../../../components/Footer/Footer"
export default function Contact() {
   return (
      <>
         <div className="contact-header" >
            <Header />
            <h1>Contact Us  </h1>

            <div className="contact-banner">
               <div className="contact-email">
                  <i className="fa-solid fa-envelope"></i>
                  <h2> By Email </h2>
                  <span> SportRental168@yahoo.com </span>
               </div>
               <div className="contact-phone">
                  <i className="fa-solid fa-phone-volume"></i>
                  <h2> By Phone number </h2>
                  <span> 023-880-880 or 010-125-168 </span>
               </div>
               <div className="contact-socialMedia">
                  <div className="contact-icon">
                     <i className="fa-brands fa-facebook"></i>
                     <i className="fa-brands fa-telegram"></i>
                  </div>
                  <h2> By Social Media </h2>
                  <span> Facebook : SportRental </span>
                  <span> Telegram : @t.me/sportrental </span>
               </div>

            </div>
         </div>
         <Footer />
      </>
   )
}
