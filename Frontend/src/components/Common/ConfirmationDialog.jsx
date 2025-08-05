import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/ConfirmationDialog.css"; // Import your custom CSS

const ConfirmationDialog = ({
  heading,
  message,
  onConfirm,
  onCancel,
  t,
  confirmParams,
}) => (
  <div className="confirmation-dialog">
    <h3>{heading}</h3>
    <hr />
    <h4>{message}</h4>
    <div className="confirmation-dialog-buttons">
      <button
        className="btn btn-danger mt-4"
        onClick={() => onConfirm(confirmParams)}
      >
        {t("Confirm")}
      </button>
      <button className="btn btn-primary mt-4" onClick={onCancel}>
        {t("Decline")}
      </button>
    </div>
  </div>
);

export const showConfirmationDialog = (
  heading,
  message,
  onConfirm,
  onCancel,
  t,
  confirmParams = null
) => {
  toast(
    <ConfirmationDialog
      heading={heading}
      message={message}
      onConfirm={(params) => {
        toast.dismiss();
        onConfirm(params);
      }}
      onCancel={() => {
        toast.dismiss();
        onCancel();
      }}
      t={t}
      confirmParams={confirmParams}
    />,
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      className: "confirmation-toast", // Custom class for the toast
    }
  );
};
