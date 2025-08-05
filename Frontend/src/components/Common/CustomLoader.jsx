import React from "react";
import "../../assets/css/CustomLoader.css"; // Import any additional styles if needed
import spinnerGif from "../../assets/images/Spinner.gif";

const CustomLoader = () => (
  <div className="loader-container">
    <img src={spinnerGif} alt="Loading..." />
  </div>
);

export default CustomLoader;
