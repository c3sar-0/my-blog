import { createContext, useState, useEffect } from "react";
import { redirect } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // I should put the login functionallity here (I think).

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  useEffect(() => {
    const refreshTokens = async () => {
      if (localStorage.refresh) {
        const response = await fetch(
          "http://localhost:8000/api/user/token/refresh/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: localStorage.refresh }),
          }
        );
        const data = await response.json();
        // console.log(response);
        if (response.statusText === "Unauthorized") {
          logout();
          return;
        }
        localStorage.access = data.access;
        localStorage.refresh = data.refresh;
      }
    };

    refreshTokens();
    const interval = setInterval(() => {
      refreshTokens();
    }, 60 * 4000);
    return () => clearInterval(interval);
  }, []);

  const contextData = {
    name: "nothing",
    logout: logout,
    isLoggedIn: true,
    setIsLoggedIn: (state) => {
      state.isLoggedIn = false;
    },
  };

  return (
    <>
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
