import React from "react";
import { Form, useSearchParams } from "react-router-dom";

const AuthForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const signupHandler = (e) => {
    e.preventDefault();
    setSearchParams({ mode: "register" });
  };

  return (
    <>
      <Form method="POST">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        {!isLogin && <label htmlFor="name">Username</label>}
        {!isLogin && <input id="name" name="name" />}
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        {isLogin && (
          <p>
            Don't have an account? <a onClick={signupHandler}>Sign up</a>.
          </p>
        )}
      </Form>
    </>
  );
};

export default AuthForm;
