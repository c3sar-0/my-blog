import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Me = () => {
  const authCtx = useContext(AuthContext);
  const me = authCtx.user;

  return (
    <>
      <h2>{me.name}</h2>
      <h2>{me.email}</h2>
    </>
  );
};

export default Me;

// export const loader = async ({ request, params }) => {
//   if (!localStorage.access) return null;
//   const response = await fetch(process.env.REACT_APP_API_URL + "user/me/", {
//     headers: { Authorization: "Bearer " + localStorage.access },
//   });

//   if (!response.ok) {
//     throw json({ message: response.statusText }, { status: response.status });
//   }

//   return response;
// };
