import { tailspin } from "ldrs";

export default function Loader() {
  tailspin.register();
  return (
    <div className="loader-container">
      <l-tailspin
        className="loader"
        size="40"
        stroke="5"
        speed="0.9"
        color="#FF4B44"></l-tailspin>
    </div>
  );
}
