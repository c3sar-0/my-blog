import React, { useRef } from "react";
import { Form, useSearchParams, useActionData } from "react-router-dom";

const AuthForm = (props) => {
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const data = useActionData();

  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const signupHandler = (e) => {
    e.preventDefault();
    setSearchParams({ mode: "register" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      body: {
        password: passwordRef.current.value,
        email: emailRef.current.value,
      },
      isLogin: true,
    };
    if (!isLogin) {
      data.body["name"] = nameRef.current.value;
      data.isLogin = false;
    }

    props.onSubmit(data);
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        {props.error && <p>{props.error}</p>}
        {data && <p>{data.detail}</p>}
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" ref={emailRef} />
        {!isLogin && <label htmlFor="name">Username</label>}
        {!isLogin && <input id="name" name="name" ref={nameRef} />}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={passwordRef}
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        {isLogin && (
          <p>
            Don't have an account? <a onClick={signupHandler}>Sign up</a>.
          </p>
        )}
      </form>
    </>
  );
};

export default AuthForm;
