import React from "react";
import RootHeader from "../components/RootHeader";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <RootHeader />
      <ErrorOutlineIcon className="error-page__icon" />
      <p className="error-page__message">Something went wrong...</p>
    </div>
  );
};

export default ErrorPage;
