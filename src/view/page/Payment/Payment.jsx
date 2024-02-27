import Header from "../../../components/Header/Header"
import Footer from "../../../components/Footer/Footer"
import ABA from "./../../../assets/BookingImags/pic18.jpg"
export default function Payment() {
   const handle_booking = () => {
      alert("You Booked Successfully");
   }
   return (
      <>
         <div className="payment-header" >
            <Header />
            <div className="payment-form">
               <div className="payment-form-field">
                  <div className="payment-form-left">
                     <h2> Book the Court</h2>
                     <div className="payment-form-1">
                        <i className="fa-solid fa-calendar-days"></i>
                        <span>Book</span>
                     </div>
                     <div className="payment-form-2">
                        <i className="fa-solid fa-clock"></i>
                        <span>Time</span>
                     </div>
                     <div className="payment-form-3">
                        <i className="fa-solid fa-phone"></i>
                        <span> *Confirm Phone Number</span>
                     </div>

                     <div className="payment-details-list">
                        <span>Details</span>
                        <div className="payment-details">
                           <span> Court:Indoor A</span>
                           <span>Duration: 2hr</span>
                           <span>Price: 20$</span>
                        </div>
                        <span> Book Price: 10$  </span>
                     </div>
                  </div>


                  <div className="payment-form-right">
                     <h2> Payment Method </h2>
                     <img src={ABA} alt="#" />
                     <button
                        className="payment-confirm"
                        onClick={handle_booking}
                     > Confirm Booking </button>
                  </div>

               </div>
            </div>
         </div>
         <Footer />
      </>
   )
}
