/* eslint-disable react/prop-types */
export default function Reciept(props) {
  return (
    <>
      <div className="reciept-information">
        <div className="reciept-sportCenter">
          <span> Sport Center Name:</span>
          <span className="reciept-text"> {props.sportCenter}</span>
        </div>

        <div className="reciept-detail">
          <div className="reciept-court">
            <span className="reciept-text">Court :</span>
            <span>{props.court}</span>
          </div>

          <div className="reciept-price">
            <span className="reciept-text"> Paid Price:</span>
            <span>{props.price}</span>
          </div>

          <div className="reciept-price">
            <span className="reciept-text">Date:</span>
            <span>{props.date}</span>
          </div>
          <div className="reciept-price">
            <span className="reciept-text">Status:</span>
            <span>{props.status}</span>
          </div>
        </div>
        <div
          className="reciept-mark"
          onClick={() => {
            alert("You want to remove booking history ");
          }}>
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      </div>
    </>
  );
}
