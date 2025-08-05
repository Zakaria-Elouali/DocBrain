import React from "react";
import FeatherIcon from "feather-icons-react";
import withRouter from "components/Common/withRouter";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Unauthorized = (props) => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "150px",
      }}
    >
      <p
        style={{
          fontSize: "140px",
          color: "Red",
        }}
      >
        &#x26A0;&#xFE0E;
      </p>
      <h1 style={{ marginTop: "20px" }}>
        {props.t("Sorry, you do not have access to this page.")}
      </h1>
      <div style={{ marginTop: "40px" }}>
        <Link
          // to="/home"
          to="/"
          style={{ fontSize: "30px" }}
          className="btn btn-primary"
        >
          {props.t("Back to home page")}
        </Link>
      </div>
    </div>
  );
};
export default withRouter(withTranslation()(Unauthorized));
