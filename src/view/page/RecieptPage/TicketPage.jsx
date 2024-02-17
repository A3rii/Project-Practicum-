import Header from "../../../components/Header/Header"
import Footer from "../../../components/Footer/Footer"
import Reciept from "./../../../components/Reciept/Reciept"
export default function TicketPage() {
   return (
      <>
         <div className="home-header" >
            <Header />
            <h2 className="reciept-page"> Your Booking History</h2>

            <Reciept
               sportCenter="Akira Sport Center"
               court="A"
               duration="2hr"
               price="20$"
               date="12 july 2022"
               status="Incoming"
            />
            <Reciept
               sportCenter="Akira Sport Center"
               court="11v11"
               duration="2hr"
               price="20$"
               date="2 july 2022"
               status="Done"
            />
            <Reciept
               sportCenter="Akira Sport Center"
               court="11v11"
               duration="2hr"
               price="20$"
               date="2 july 2022"
               status="Done"
            />
            <Reciept
               sportCenter="Akira Sport Center"
               court="11v11"
               duration="2hr"
               price="20$"
               date="2 july 2022"
               status="Done"
            />

         </div>
         <Footer />
      </>
   )
}
