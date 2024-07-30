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
        color="#00D062"></l-tailspin>
    </div>
  );
}
