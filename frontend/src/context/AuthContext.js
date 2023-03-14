import { createContext, useState, useEffect } from "react";
import { redirect, Outlet, useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: {},
  logout: () => {},
  authenticate: () => {},
  isLoggedIn: false,
  authError: "",
});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    return navigate("/");
  };

  const authenticate = async (data) => {
    let url = process.env.REACT_APP_API_URL + "user/";
    url = data.isLogin ? url + "token/" : url + "users/";

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
      return navigate("/");
    }

    if (response.ok && !data.isLogin) {
      setAuthError(null);
      return navigate("/auth?mode=login");
    }

    if (!response.ok) {
      setAuthError(resData.detail);
      return;
    }
  };

  useEffect(() => {
    // Refreshing tokens
    const refreshTokens = async () => {
      if (localStorage.refresh) {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "user/token/refresh/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: localStorage.refresh }),
          }
        );
        const data = await response.json();
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

  useEffect(() => {
    // Get logged user (if any).
    if (isLoggedIn) {
      const getUser = async () => {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "user/me/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.access,
            },
          }
        );
        const me = await response.json();
        setUser(me);
      };

      try {
        getUser();
      } catch (error) {
        console.log("Error: ", error.message);
      }
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const contextData = {
    user: user,
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
