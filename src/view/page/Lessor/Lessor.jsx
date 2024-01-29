import Header from "../../../components/Header/Header"
import Footer from "./../../../components/Footer/Footer"

export default function Lessor() {


   return (
      <>
         <div className="lessor-header" >
            <Header />
            <div className="lessor-banner">
               <h2> Become a Lessor </h2>
               <form className="lessor-form">

                  <div className="lessor-name">

                     <div className="lessor-description">
                        <label> Firstname</label>
                        <input type="text" className="lessor-input" />
                     </div>

                     <div className="lessor-description">
                        <label> Lastname</label>
                        <input type="text" className="lessor-input" />
                     </div>
                  </div>


                  <div className="lessor-name">

                     <div className="lessor-description">
                        <label>Email</label>
                        <input type="text" className="lessor-input" />
                     </div>

                     <div className="lessor-contact">
                        <div className="lessor-contact-1">
                           <label>  Sport Center Name</label>
                           <input type="text" className="lessor-input" />
                        </div>
                        <div className="lessor-contact-1">
                           <label> Contact Number </label>
                           <input type="text" className="lessor-input" />
                        </div>

                     </div>
                  </div>

                  <div className="lessor-contact-address">
                     <label>Password </label>
                     <input type="text" className="lessor-input" />
                  </div>
                  <div className="lessor-contact-address">
                     <label>*Confirm Password </label>
                     <input type="text" className="lessor-input" />
                  </div>



                  <div className="lessor-contact-address">
                     <label>Sport Center Addresss </label>
                     <input type="text" className="lessor-input" />
                  </div>


                  <div className="lessor-contact-image">
                     <label>Upload Image Of your Sport Center</label>
                     <input type="file" className="file-input" accept="image/*" />

                     <div className="submit-container">
                        <button className="btn btn-danger btn-lg">Submit</button>
                     </div>
                  </div>



               </form>
            </div>
         </div>
         <Footer />
      </>
   )
}
