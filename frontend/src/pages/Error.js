import React from "react";
import { useRouteError } from "react-router-dom";
import RootHeader from "../components/RootHeader";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="error-page">
      <RootHeader />
      <ErrorOutlineIcon className="error-page__icon" />
      <p className="error-page__message">Something went wrong...</p>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorPage;
