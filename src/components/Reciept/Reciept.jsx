export default function Reciept() {

   return (
      <>


         <div className="reciept-information">
            <div className="reciept-sportCenter">

               <span> Sport Center Name:</span>
               <span className="reciept-text" >Akira Sport Centers</span>
            </div>

            <div className="reciept-detail">


               <div className="reciept-court">
                  <span className="reciept-text"> Court :</span>
                  <span>A</span>
               </div>


               <div className="reciept-duration">
                  <span className="reciept-text"> Duration:</span>
                  <span>2hr</span>
               </div>


               <div className="reciept-price">
                  <span className="reciept-text"> Paid Price:</span>
                  <span>10$</span>
               </div>

               <div className="reciept-price">
                  <span className="reciept-text">Date:</span>
                  <span>12 July 2023</span>
               </div>

            </div>
            <div
               className="reciept-mark"
               onClick={() => {
                  alert("You want to remove booking history ");
               }}
            >
               <i className="fa-solid fa-circle-xmark"></i>
            </div>

         </div>



      </>
   )
}
