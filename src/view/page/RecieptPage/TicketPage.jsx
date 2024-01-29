import Header from "../../../components/Header/Header"
import Footer from "../../../components/Footer/Footer"
import Reciept from "./../../../components/Reciept/Reciept"
export default function TicketPage() {
   return (
      <>
         <div className="home-header" >
            <Header />
            <h2 className="reciept-page"> Your Booking History</h2>

            <Reciept />

         </div>
         <Footer />
      </>
   )
}
