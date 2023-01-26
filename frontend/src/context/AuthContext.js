import { createContext, useState, useEffect } from "react";
import { redirect, Outlet } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // I should put the login functionallity here (I think).
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(null);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
  };

  const authenticate = async (data) => {
    let url = "http://localhost:8000/api/user/";
    url = data.isLogin ? url + "token/" : url + "create/";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data.body),
      headers: { "Content-Type": "application/json" },
    });

    const resData = await response.json();

    if (response.ok && data.isLogin) {
      setIsLoggedIn(true);
      localStorage.setItem("access", resData.access);
      localStorage.setItem("refresh", resData.refresh);
      setAuthError(null);
      console.log("logged in");
      redirect("/");
    }

    if (response.ok && !data.isLogin) {
      setAuthError(null);
      redirect("/auth?mode=login");
    }

    if (!response.ok) {
      console.log("detail: ", resData.detail);
      setAuthError(resData.detail);
      return;
    }
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
        setIsLoggedIn(true);
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
    isLoggedIn: isLoggedIn,
    authenticate: authenticate,
    authError: authError,
  };

  return (
    <>
      <AuthContext.Provider value={contextData}>
        <Outlet />
      </AuthContext.Provider>
    </>
  );
};
